require('dotenv').config()
const express = require('express')
const http = require('http')
const Server = require('socket.io').Server
const jwt = require('jsonwebtoken')

const db = require('./models')
const { Conversation, User, Message, UserConversation } = require('./models')
const { Op, where, literal } = require("sequelize")

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    next();
});

const port = 3000

db.sequelize.sync().then(() => {
    httpServer.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})


io.on('connection', (socket) => {
    console.log("New client connected!")
    socket.currentConversationId = 0
    socket.join(`${socket.user.id}-notif`)

    socket.on('disconnect', () => {
        console.log("Client disconnected!")
    })

    socket.on('change-conversation', ({id}) => {
        socket.leave(socket.currentConversationId)
        socket.currentConversationId = id
        socket.join(socket.currentConversationId)
    })

    socket.on('client-send-message', async ({message}) => {
        try {
            const msg = await Message.create({
                message: message,
                conversationId: socket.currentConversationId,
                senderId: socket.user.id
            })
            socket.to(socket.currentConversationId).emit('server-send-message', {
                id: msg.id,
                message: message,
                senderId: socket.user.id,
                User: {
                    username: socket.user.username
                }
            })
        } catch (e) {
            return socket.emit('error', e)
        }
    })

    socket.on('new-conversation-notification', ({userIds, conversation}) => {
        for(const id of userIds) {
            socket.join(`${id}-notif`)
            socket.to(`${id}-notif`).emit('new-conversation', conversation)
            socket.leave(`${id}-notif`)
        }
    })
})

function authenticateTokenExpress(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
    console.log("Authenticating")

    if(token == null || token == undefined) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error) {
            console.error(error)
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

const authenticateTokenSocket = (socket, next) => {
    const authHeader = socket.handshake.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    console.log("Authenticating")

    if(!token) {
        next(new Error("No token was sent"))
        return
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error) {
            next(new Error("Incorrect or expired token"))
            return
        }

        socket.user = user
        next()
    })
}
io.use(authenticateTokenSocket)

app.get("/conversations", authenticateTokenExpress, async (req, res) => {
    try {
        const conv = await Conversation.findAll({
            include: {
                model: User,
                required: true,
                where: {
                    id: req.user.id
                }
            }
        })
        if(!conv || conv.length <= 0) {
            return res.sendStatus(404)
        }
        const conversationIds = conv.map(con => con.id)
        const conversations = await Conversation.findAll({
            include: {
                model: User,
                required: true,
                attributes: ['id', 'username']
            },
            where: {
                id: {
                    [Op.in]: conversationIds
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.json(conversations)
    } catch(e) {
        return res.status(500).send(e.message)
    }
})

app.get('/messages/:convId', authenticateTokenExpress, async (req, res) => {
    const convId = new Number(req.params.convId) //FIXME:check if convId is a number
    try {
        const convUsers = await User.findAll({
            include: {
                model: Conversation,
                required: true,
                where: {
                    id: convId
                }
            }
        })
        const userCheck = convUsers.filter(usr => usr.id === req.user.id)
        if(userCheck.length <= 0) {
            return res.sendStatus(403)
        }
        const messages = await Message.findAll({
            where: {
                conversationId: convId
            },
            attributes: {
                exclude: ['conversationId']
            },
            include: {
                model: User,
                required: true,
                attributes: {
                    exclude: ['password']
                }
            }
        })
        res.json(messages)
    } catch (e) {
        return res.sendStatus(500)
    }
})

app.post('/conversation', authenticateTokenExpress, async (req, res) => {
    const name = req.body.name
    let userIds = req.body.users
    let onlyThisUsersId = true
    if(!userIds || userIds.length == 0) {
        return res.sendStatus(401)
    }
    for(const id of userIds) {
        if(id != req.user.id) {
            onlyThisUsersId = false
            break
        }
    }
    if(onlyThisUsersId) {
        userIds = [req.user.id]
    }

    try {
        const checkUsers = await User.findAll({
            where: {
                id: {
                    [Op.in]: userIds
                }
            }
        })
        if(checkUsers.length != userIds.length) {
            return res.sendStatus(404)
        }
        userIds.push(req.user.id)

        const conv = await Conversation.create({
            name: name
        })

        for(const usrId of userIds) {
            await UserConversation.create({
                userId: usrId,
                conversationId: conv.id
            })
        }
        const Users = await User.findAll({
            where: {
                id: {
                    [Op.in] : userIds
                }
            },
            attributes: {
                exclude: ['password']
            }
        })
        res.status(201).json({
            id: conv.id,
            Users: Users,
            name: name
        })
    } catch (e) {
        return res.sendStatus(500)
    }
})

app.get('/user/:name', authenticateTokenExpress, async (req, res) => {
    const name = req.params.name
    try {
        let users = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${name}%`
                }
            },
            attributes: {
                exclude: ['password']
            },
            order: [
                [db.Sequelize.fn("LENGTH", db.sequelize.col('username')), 'ASC']
            ]
        })
        if(users.length <= 0) {
            return res.sendStatus(404)
        }
        users = users.filter(usr => usr.id !== req.user.id)
        res.json(users)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

app.get('/conversations/users/:id1/:id2', authenticateTokenExpress, async (req, res) => {
    const id1 = new Number(req.params.id1) //FIXME: check if id1 is a number
    const id2 = new Number(req.params.id2) //FIXME: check if id2 is a number

    try {
        const conv = await Conversation.findAll({
            include: {
                model: User,
                required: true,
                attributes: {
                    exclude: ['password']
                },
                where: {
                    id: {
                        [Op.in]: [id1, id2]
                    }
                }
            }
        })
        let conversationIds = conv.filter(c => c.Users.length == 2)
        conversationIds = conversationIds.map(c => c.id)
        const conversations = await Conversation.findAll({
            include: {
                model: User,
                required: true,
                attributes: {
                    exclude: ['password']
                }
            },
            where: {
                id: {
                    [Op.in]: conversationIds
                }
            }
        })
        const convs = conversations.filter(c => c.Users.length == 2)
        res.json(convs)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})
