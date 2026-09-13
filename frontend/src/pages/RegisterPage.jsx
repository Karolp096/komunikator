import { ArrowLeft } from "lucide-react"
import Button from "../components/Button"
import RegisterForm from "../components/RegisterForm"
import Page from "../components/Page"

const RegisterPage = () => {
    return (
        <Page title="Register">
            <Button isLink={true} href="/" className="size-12"><ArrowLeft /></Button>
            <RegisterForm />
        </Page>
    )
}

export default RegisterPage