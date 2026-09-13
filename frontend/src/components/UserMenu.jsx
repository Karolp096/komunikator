import { LogOut, UserCircle } from "lucide-react"
import Button from "./Button"
import SlideOutMenu from "./SlideOutMenu"
import { useTranslation } from "react-i18next"
import { useContext } from "react"
import { UserAuthContext } from "../contexts/UserAuthContext"

const UserMenu = ({ isMenuOpen, setIsMenuOpen }) => {
    const { user } = useContext(UserAuthContext)

    const { t } = useTranslation()

    return (
        <SlideOutMenu
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
        >
            <div className="flex flex-col items-center">
                <UserCircle className="size-10" />
                <p>{user.username}</p>
            </div>
            <hr />
            <Button
                intent="secondary"
                btnType="notRound"
                isLink={true}
                href="/logout"
            >
                <div className="flex gap-5">
                    {t("logout")} <LogOut />
                </div>
            </Button>
        </SlideOutMenu>
    )
}

export default UserMenu