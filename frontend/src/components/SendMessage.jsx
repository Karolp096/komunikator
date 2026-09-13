import { useContext, useEffect, useRef, useState } from "react"
import AppConnectionSocketContext from "../contexts/AppConnectionSocketContext"
import { UserAuthContext } from "../contexts/UserAuthContext"
import TextField from "./TextField"
import Button from "./Button"
import { Send } from "lucide-react"
import { useTranslation } from "react-i18next"

const SendMessage = ({ conversationId, setMessages, lastMsgId, setLastMsgId }) => {
    const { socket } = useContext(AppConnectionSocketContext)
    const { user } = useContext(UserAuthContext)
    const { t } = useTranslation()

    const [messageToSend, setMessageToSend] = useState("")

    const sendMsgField = useRef(null)

    function clearMsgField() {
        setMessageToSend("")
        sendMsgField.current.value = ""
    }

    useEffect(() => {
        clearMsgField()
        sendMsgField.current.focus()
    }, [conversationId])

    return (
        <form
            className="flex gap-2"
            onSubmit={e => {
                e.preventDefault()
                if (!messageToSend) {
                    return
                }
                socket.emit('client-send-message', {
                    message: messageToSend
                })
                const msgObj = {
                    id: lastMsgId + 1,
                    message: messageToSend,
                    senderId: user.id,
                    User: {
                        username: user.username
                    }
                }
                setLastMsgId(lastMsgId + 1)
                setMessages(m => [...m, msgObj])
                clearMsgField()
            }}
        >
            <TextField
                type="text"
                id="message"
                name="message"
                setState={setMessageToSend}
                withLabel={false}
                wrapperClassName="flex-1"
                fieldRef={sendMsgField}
                placeholder={`${t("message")}...`}
            />
            <Button type="submit" title={t("send_msg")}><Send /></Button>
        </form>
    )
}

export default SendMessage