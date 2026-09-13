import LoginForm from "../components/LoginForm"
import { ArrowLeft } from "lucide-react"
import Button from "../components/Button"
import Page from "../components/Page"

const LoginPage = () => {
  return (
    <Page title="Messaging app">
      <Button isLink={true} href="/" className="size-12"><ArrowLeft /></Button>
      <LoginForm />
    </Page>
  )
}

export default LoginPage