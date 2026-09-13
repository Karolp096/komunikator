import { useContext, useEffect, useRef } from "react"
import { UserAuthContext } from "../contexts/UserAuthContext"
import { twMerge } from "tailwind-merge"

const Message = ({msg}) => {
    const { user } = useContext(UserAuthContext)
    const anchorRef = useRef(null)

    const sentStyles = msg.senderId == user.id ? 
        "bg-blue-500 text-white" :
        "bg-neutral-300 dark:bg-neutral-700 dark:text-white"

    useEffect(() => {
        anchorRef.current.scrollIntoView()
    }, [])

    return (
        <div className={(msg.senderId == user.id ? "self-end text-right" : "") + " max-w-[80%]"}>
            {msg.senderId == user.id ||
            (
                <small className="select-none">{msg.User.username}</small>
            )}
            <div
                className={twMerge("w-fit p-3 rounded-4xl wrap-anywhere text-left", sentStyles)}
            >
                {msg.message}
                <div ref={anchorRef}></div>
            </div>
        </div>
    )
}

export default Message