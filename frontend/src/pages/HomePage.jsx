import { useContext } from "react"
import { UserAuthContext } from "../contexts/UserAuthContext"
import Page from "../components/Page"
import Button from "../components/Button"
import { useTranslation } from "react-i18next"

const HomePage = () => {
  const { user } = useContext(UserAuthContext)
  const { t } = useTranslation()
  return (
    <Page title="Messaging app - Home">
      <div className="flex flex-col gap-7">
        <h1>{t("welcome_message")}</h1>
        {user ? (
          <Button isLink={true} href={'/app'}>{t("go_to_app")}</Button>
        ) : (
          <div className="flex gap-3">
            <Button isLink={true} href={'/login'}>{t("login")}</Button>
            <Button isLink={true} href={'/register'}>{t("register")}</Button>
          </div>
        )}
      </div>
    </Page>
  )
}

export default HomePage