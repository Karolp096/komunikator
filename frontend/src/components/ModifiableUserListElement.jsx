import Button from "./Button"
import { X } from "lucide-react"

const ModifiableUserListElement = ({user, removeUser}) => {
    return (
        <li>
            <Button
                intent="secondary"
                className="gap-2 bg-neutral-200 dark:bg-neutral-600"
                onClick={() => {
                    removeUser(user)
                }}
            >
                {user.username} <X />
            </Button>
        </li>
    )
}

export default ModifiableUserListElement