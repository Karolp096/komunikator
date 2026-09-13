import { useCallback, useEffect, useEffectEvent, useMemo, useState } from "react"
import { UserAuthContext } from "./UserAuthContext"
import { useTranslation } from "react-i18next"

const backendUrl = import.meta.env.VITE_AUTH_SERVER_URL
const minute = 60 * 1000

const UserAuthProvider = ({children}) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))

    const { t } = useTranslation()

    const login = useCallback(async (login, password) => {
        const res = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: login,
                password: password
            })
        })

        if(!res.ok) {
            //TODO: think of a better way of handling error codes
            let errorToThrow = `${res.status} ${res.statusText}`
            switch(res.status) {
                case 401:
                case 403:
                case 404:
                    errorToThrow = t("err_incorrect_name_pass")
                    break
                case 500:
                    errorToThrow = t("err_server")
                    break
            }
            throw new Error(errorToThrow)
        }

        const json = await res.json()
        localStorage.setItem("user", JSON.stringify(json))
        setUser(json)
    }, [t])

    const logout = useCallback(async () => {
        if(user === null) {
            return
        }

        const res = await fetch(`${backendUrl}/logout`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: user.refreshToken
            })
        })

        if(!res.ok) {
            //TODO: think of a better way of handling error codes
            let errorToThrow = `${res.status} ${res.statusText}`
            switch(res.status) {
                case 500:
                    errorToThrow = t("err_server")
                    break
            }
            throw new Error(errorToThrow)
        }

        localStorage.removeItem("user")
        setUser(null)
    }, [t, user])

    const register = useCallback(async (login, password, confirmPassword) => {
        const res = await fetch(`${backendUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: login,
                password: password,
                confirmPassword: confirmPassword
            })
        })

        if(!res.ok) {
            //TODO: think of a better way of handling error codes
            let errorToThrow = `${res.status} ${res.statusText}`
            switch(res.status) {
                case 401:
                    errorToThrow = t("err_provide_all_info")
                    break
                case 403:
                    errorToThrow = t("err_incorrect_info")
                    break
                case 409:
                    errorToThrow = t("err_user_exists")
                    break
                case 500:
                    errorToThrow = t("err_server")
                    break
            }
            throw new Error(errorToThrow)
        }
    }, [t])

    const generateNewToken = useCallback(async (refreshToken) => {
        const res = await fetch(`${backendUrl}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        })

        if(!res.ok) {
            let errorToThrow = `${res.status} ${res.statusText}`
            switch(res.status) {
                case 403:
                    errorToThrow = t("err_auth")
                    break
                case 500:
                    errorToThrow = t("err_server")
                    break
            }
            throw new Error(errorToThrow)
        }

        const json = await res.json()
        return json.accessToken
    }, [t])

    const changeAccessToken = async () => {
        if(user === null) {
            return
        }

        let token
        try {
            token = await generateNewToken(user.refreshToken)
        } catch(e) {
            console.log(e)
            localStorage.removeItem("user")
            setUser(null)
            return
        }

        setUser(u => {
            const usr = {...u, accessToken: token}
            localStorage.removeItem("user")
            localStorage.setItem("user", JSON.stringify(usr))
            return usr
        })
    }

    const timer = useEffectEvent(() => {
        if(user === null) {
            return
        }
        const tokenTimer = setTimeout(() => {
            changeAccessToken()
        }, 10 * minute)

        return () => {
            clearTimeout(tokenTimer)
        }
    })

    useEffect(() => {
        changeAccessToken()
    }, [])

    useEffect(() => {
        return timer()
    }, [user])

    const contextValues = useMemo(() => {
        return {
            user,
            login,
            logout,
            register,
            generateNewToken
        }
    }, [user, login, logout, register, generateNewToken])

    return (
        <UserAuthContext.Provider value={contextValues}>
            {children}
        </UserAuthContext.Provider>
    )
}

export default UserAuthProvider