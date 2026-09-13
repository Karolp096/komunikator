import { useContext, useEffect } from "react"
import { Loader2 } from "lucide-react"
import Conversation from "./Conversation"
import ConversationContext from "../contexts/ConversationContext"

const Conversations = () => {
    const { conversations, isLoading } = useContext(ConversationContext)

    return (
        <div
            className="flex flex-1 flex-col gap-2 p-3 overflow-auto"
        >
            {isLoading ? <Loader2 className="animate-spin text-blue-500" size="2.5em" /> :
            conversations.map(conv => (
                <Conversation convObject={conv} key={conv.id} />
            ))}
        </div>
    )
}

export default Conversations