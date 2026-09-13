import { useContext, useState } from "react"
import Button from "./Button"
import Form from "./Form"
import TextField from "./TextField"
import { UserAuthContext } from "../contexts/UserAuthContext"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import getError from "../utilities/getError"

const RegisterForm = ({ className }) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const { login, register } = useContext(UserAuthContext)
    const { t } = useTranslation()

    async function handleRegistration() {
        setIsLoading(true)
        try {
            await register(username, password, confirmPassword)
            await login(username, password)
        } catch (e) {
            setError(e)
            return
        } finally {
            setIsLoading(false)
        }
        navigate('/app')
    }

    return (
        <Form
            className={className}
            error={getError(error)}
            onSubmit={() => {
                if(username == "" || password == "" || confirmPassword == "") {
                    setError(t("err_provide_all_info"))
                    return
                }

                const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])([^\s]){8,20}/
                if(!passwordRegex.test(password)) {
                    setError(t("err_pass_req"))
                    return
                }
                
                if(password !== confirmPassword) {
                    setError(t("err_pass_no_match"))
                    return
                }

                handleRegistration()
            }}
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
            <TextField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                displayedName={t("confirm_password")}
                setState={setConfirmPassword}
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : t("register")}
            </Button>
        </Form>
    )
}

export default RegisterForm