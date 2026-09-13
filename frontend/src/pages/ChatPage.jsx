import { useContext, useEffect, useRef, useState, useCallback } from "react"
import AppConnectionSocketContext from "../contexts/AppConnectionSocketContext"
import { useNavigate, useParams } from "react-router-dom"
import Page from "../components/Page"
import { Loader2 } from "lucide-react"
import { UserAuthContext } from "../contexts/UserAuthContext"
import Message from "../components/Message"
import ErrorMessage from "../components/ErrorMessage"
import { useTranslation } from "react-i18next"
import SendMessage from "../components/SendMessage"
import getError from "../utilities/getError"

const ChatPage = () => {
    const { socket } = useContext(AppConnectionSocketContext)
    const { user } = useContext(UserAuthContext)
    
    const prevId = useRef(0)
    const fetchMsgCalled = useRef(false)
    
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [lastMsgId, setLastMsgId] = useState(1)
    
    const { id } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_SERVER_URL

    function addMessage(msg) {
        setMessages(m => [...m, msg])
        setLastMsgId(msg.id)
    }

    const fetchMessages = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${backendUrl}/messages/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })

            if(!res.ok) {
                let errorToThrow
                switch(res.status) {
                    case 401:
                        errorToThrow = ""
                        break
                    case 403:
                        navigate('/app')
                        errorToThrow = t("err_auth")
                        break
                    case 500:
                        errorToThrow = t("err_server")
                        break
                    default:
                        errorToThrow = `${res.status} ${res.statusText}`
                        break
                }
                throw new Error(errorToThrow)
            }

            const msgs = await res.json()
            setMessages(msgs)
            if(msgs.length > 0) {
                setLastMsgId(msgs[msgs.length - 1].id)
            }
        } catch (e) {
            setError(e)
            return
        } finally {
            setIsLoading(false)
        }
    }, [id, user.accessToken])

    useEffect(() => {
        if(prevId.current == id && fetchMsgCalled.current) {
            return
        }
        fetchMessages()
        fetchMsgCalled.current = true
        prevId.current = id
    }, [id, fetchMessages])

    useEffect(() => {
        if(socket == null) {
            return
        }
        socket.emit('change-conversation', { id: id })
        socket.on('server-send-message', addMessage)
        return () => {
            socket.removeListener('server-send-message', addMessage)
        }
    }, [id, socket])

    useEffect(() => {
        setError("")
    }, [id])

    return (
        <Page title={`Messaging app`}>
            <div className="flex flex-col gap-3 flex-1 p-2 overflow-auto scroll-smooth">
                {isLoading ?
                    <Loader2 className="animate-spin text-blue-500" size="2.5em" /> :
                    error ? <ErrorMessage message={getError(error)} type="box" /> :
                    messages.map((msg) => (<Message key={msg.id} msg={msg} />))
                }
            </div>
            <SendMessage
                conversationId={id}
                setMessages={setMessages}
                lastMsgId={lastMsgId}
                setLastMsgId={setLastMsgId}
            />
        </Page>
    )
}

export default ChatPage