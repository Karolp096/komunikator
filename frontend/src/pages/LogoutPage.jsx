import { useCallback, useContext, useEffect } from "react"
import { UserAuthContext } from "../contexts/UserAuthContext"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import Page from "../components/Page"

const LogoutPage = () => {
    const { logout } = useContext(UserAuthContext)
    const navigate = useNavigate()

    const handleLogout = useCallback(async () => {
        await logout()
        navigate('/')
    }, [logout, navigate])

    useEffect(() => {
        handleLogout()
    }, [handleLogout])

    return (
        <Page title="Logging out...">
            <Loader2 className="animate-spin text-blue-500" size="2.5em" />
        </Page>
    )
}

export default LogoutPage