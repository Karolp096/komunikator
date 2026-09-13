import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { UserAuthContext } from "../contexts/UserAuthContext"
import { twMerge } from "tailwind-merge"
import Button from "./Button"

const Conversation = ({ convObject }) => {
    const { user } = useContext(UserAuthContext)
    const [conversationUsers, setConversationUsers] = useState(() => convObject.Users.filter(usr => usr.id != user.id))
    const defaultStyle = "items-start"
    const [style, setStyle] = useState(defaultStyle)
    const thisObj = useRef(null)
    const { id } = useParams()

    useEffect(() => {
        if(id == convObject.id) {
            setStyle(s => twMerge(s, "bg-neutral-200 dark:bg-neutral-700"))
            //thisObj.current.scrollIntoView()
        } else {
            setStyle(defaultStyle)
        }
    }, [convObject.id, id])

    return (
        <Button
            isLink={true}
            href={`/app/${convObject.id}`}
            className={style}
            ref={thisObj}
            intent="secondary"
            btnType="notRound"
        >
            {convObject.name ? convObject.name : conversationUsers.map(usr => usr.username).join(", ")}
        </Button>
    )
}

export default Conversation