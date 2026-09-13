require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const accessTokenExpiration = '10 min'
const refreshTokenExpiration = '7 days'

const db = require('./models')
const { User, RefreshToken } = require('./models')

app.use(express.json())

const port = 3010
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Authentication server running on port " + port)
    })
})

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.post('/login', async (req, res) => {
    const user = req.body
    if(user == null || user.username == null || user.password == null) {
        return res.sendStatus(401)
    }
    if(user.username == "" || user.password == "") {
        return res.sendStatus(401)
    }

    let dbUsers
    try {
        dbUsers = await User.findAll({
            where: {
                username: user.username
            }
        })
    } catch (e) {
        return res.status(500).json({
            message: e.message + "db finding user"
        })
    }
    if(dbUsers == null || dbUsers.length <= 0) {
        return res.sendStatus(404)
    }
    if(dbUsers.length > 1) {
        return res.sendStatus(500)
    }

    const userInDb = dbUsers[0]

    try {
        if(!await bcrypt.compare(user.password, userInDb.password)) {
            return res.sendStatus(403)
        }
    } catch(e) {
        return res.sendStatus(403)
    }

    const usr = {
        id: userInDb.id,
        username: user.username,
        sourceOfToken: 'login'
    }
    const accessToken = jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExpiration })

    const refreshToken = jwt.sign(usr, process.env.REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExpiration })
    try {
        await RefreshToken.create({
            token: refreshToken
        })
    } catch(e) {
        return res.status(500).json({
            message: e.message + "adding token to db"
        })
    }

    res.json({
        id: usr.id,
        username: usr.username,
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

app.post('/register', async (req, res) => {
    const userToRegister = req.body
    if(userToRegister == null) {
        return res.sendStatus(401)
    }

    let dbUsers
    try {
        dbUsers = await User.findAll({
            where: {
                username: userToRegister.username
            }
        })
    } catch(e) {
        return res.status(500).json({
            message:e.message + "db finding user"
        })
    }

    if(dbUsers.length > 0) {
        return res.sendStatus(409)
    }

    const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])([^\s]){8,20}/
    if(!passwordRegex.test(userToRegister.password)) {
        return res.sendStatus(403)
    }

    if(userToRegister.password !== userToRegister.confirmPassword) {
        return res.sendStatus(403)
    }

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(userToRegister.password, 10)
    } catch(e) {
        return res.status(403).json({
            message: e.message
        })
    }

    try {
        await User.create({
            username: userToRegister.username,
            password: hashedPassword
        })
    } catch(e) {
        return res.status(500).json({
            message: e.message + "db adding user"
        })
    }

    res.sendStatus(201)
})

app.post('/token', async (req, res) => {
    const token = req.body.refreshToken
    if(token == null || token == "") {
        return res.sendStatus(401)
    }

    let tokenInDb
    try {
        tokenInDb = await RefreshToken.findAll({
            where: {
                token: token
            }
        })
    } catch(e) {
        return res.status(500).json({
            message: e.message + "db finding token"
        })
    }

    if(tokenInDb.length <= 0) {
        return res.sendStatus(403)
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    if(!decoded) {
        try {
            await RefreshToken.destroy({
                where: {
                    token: token
                }
            })
        } catch(e) {
            return res.status(500).json({
                message: e.message + "db removing token"
            })
        }
        return res.sendStatus(403)
    }

    const user = {
        id: decoded.id,
        username: decoded.username,
        password: decoded.password,
        sourceOfToken: 'refresh'
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({
        accessToken: accessToken
    })
})

app.delete('/logout', async (req, res) => {
    const token = req.body.refreshToken
    if(!token) {
        return res.sendStatus(401)
    }
    
    try {
        await RefreshToken.destroy({
            where: {
                token: token
            }
        })
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            message: e.message
        })
    }

    res.sendStatus(200)
})