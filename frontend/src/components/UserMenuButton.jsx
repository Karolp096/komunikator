import { UserCircle } from "lucide-react"
import Button from "./Button"
import { useState } from "react"
import UserMenu from "./UserMenu"

const UserMenuButton = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="relative">
            <Button
                onClick={() => setIsMenuOpen(true)}
            >
                <UserCircle />
            </Button>
            <UserMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
    )
}

export default UserMenuButton