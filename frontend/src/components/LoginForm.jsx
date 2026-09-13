import { useContext, useEffect, useState } from "react"
import Button from "./Button"
import TextField from "./TextField"
import { UserAuthContext } from "../contexts/UserAuthContext"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import Form from "./Form"
import { useTranslation } from "react-i18next"
import getError from "../utilities/getError"

const LoginForm = ({className}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const { user, login } = useContext(UserAuthContext)
    const navigate = useNavigate()

    const { t } = useTranslation()

    
    useEffect(() => {
        if(user !== null) {
            navigate('/app')
        }
    }, [user, navigate])

    async function handleLogin() {
        setIsLoading(true)
        let err
        try {
            await login(username, password)
        } catch (e) {
            setError(e)
            return
        } finally {
            setIsLoading(false)
        }
        if(!error && user) {
            navigate('/app')
        }
        
    }

    return (
        <Form
            className={className}
            onSubmit={() => {
                if(username == '' || password == '') {
                    setError(t("err_provide_all_info"))
                    return
                }
                const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])([^\s]){8,20}/
                if(!passwordRegex.test(password)) {
                    setError(t("err_incorrect_name_pass"))
                    return
                }
                handleLogin()
            }}
            error={getError(error)}
        >
            <TextField
                type="text"
                id="username"
                name="username"
                displayedName={t("username")}
                setState={setUsername}
            />
            <TextField
                type="password"
                id="password"
                name="password"
                displayedName={t("password")}
                setState={setPassword}
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin self-center" /> : t("login")}
            </Button>
        </Form>
    )
}

export default LoginForm