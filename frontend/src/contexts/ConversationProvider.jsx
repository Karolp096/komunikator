import { useTranslation } from "react-i18next"
import AppConnectionSocketContext from "./AppConnectionSocketContext"
import ConversationContext from "./ConversationContext"
import { UserAuthContext } from "./UserAuthContext"
import { useState, useContext, useEffect, useCallback, useMemo, useRef } from "react"

const ConversationProvider = ({children}) => {
    const { user } = useContext(UserAuthContext)
    const [error, setError] = useState("")
    const [conversations, setConversations] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const values = useMemo(() => ({conversations, setConversations, isLoading, error}), [conversations, setConversations, isLoading, error])
    const fetchConvCalled = useRef(false)
    const { socket } = useContext(AppConnectionSocketContext)
    const backendUrl = import.meta.env.VITE_SERVER_URL
    const { t } = useTranslation()
    
    const fetchConversations = useCallback(async () => {
        if(!user) {
            return
        }
        try {
            setIsLoading(true)
            const res = await fetch(`${backendUrl}/conversations`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
    
            if(!res.ok) {
                switch(res.status) {
                    case 401:
                        setError(t("err_auth"))
                        break
                    case 403:
                        setError(t("err_auth"))
                        break
                    case 500:
                        setError(t("err_server"))
                        break
                }
                return
            }
    
            const json = await res.json()
            setConversations(json)
        } catch(e) {
            setError(e)
            return
        } finally {
            setIsLoading(false)
        }
    }, [user])
    
    useEffect(() => {
        if(fetchConvCalled.current) {
            return
        }
        fetchConversations()
        fetchConvCalled.current = true

        socket.on('new-conversation', () => {
            fetchConversations()
        })
    }, [fetchConversations, fetchConvCalled, socket])

    return (
        <ConversationContext.Provider value={values}>
            {children}
        </ConversationContext.Provider>
    )
}

export default ConversationProvider