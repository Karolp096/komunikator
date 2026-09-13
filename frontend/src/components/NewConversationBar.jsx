import SearchUser from "./SearchUser"
import NewGroupButton from "./NewGroupButton"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useContext, useState } from "react"
import { UserAuthContext } from "../contexts/UserAuthContext"
import ConversationContext from "../contexts/ConversationContext"
import Dialog from "./Dialog"
import getError from "../utilities/getError"
import ErrorMessage from "./ErrorMessage"

const NewConversationBar = () => {
    const { user } = useContext(UserAuthContext)
    const { setConversations } = useContext(ConversationContext)

    const navigate = useNavigate()
    const { t } = useTranslation()

    const backendUrl = import.meta.env.VITE_SERVER_URL

    const [error, setError] = useState("")
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)

    async function newConversation(userId) {
        if(isNaN(userId) || isNaN(parseInt(userId))) {
            return
        }
        try {
            const checkRes = await fetch(`${backendUrl}/conversations/users/${user.id}/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            if(!checkRes.ok) {
                let errorToThrow = ''
                switch(checkRes.status) {
                    case 401:
                        errorToThrow = t("err_auth")
                        break
                    case 403:
                        errorToThrow = t("err_auth")
                        break
                    case 500:
                        errorToThrow = t("err_server")
                        break
                    default:
                        errorToThrow = `${checkRes.status} ${checkRes.statusText}`
                        break
                }
                throw new Error(errorToThrow)
            }

            const check = await checkRes.json()
            if(check.length > 0) {
                navigate(`/app/${check[0].id}`)
                return
            }

            const createRes = await fetch(`${backendUrl}/conversation`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: null,
                    users: [userId]
                })
            })

            if(!createRes.ok) {
                let errorToThrow = ''
                switch(createRes.status) {
                    case 401:
                        errorToThrow = t("err_auth")
                        break
                    case 403:
                        errorToThrow = t("err_auth")
                        break
                    case 500:
                        errorToThrow = t("err_server")
                        break
                    case 404:
                        errorToThrow = t("err_user_not_exist")
                        break
                    default:
                        errorToThrow = `${createRes.status} ${createRes.statusText}`
                        break
                }
                throw new Error(errorToThrow)
            }

            const createdConversation = await createRes.json()
            setConversations(conv => [createdConversation, ...conv])
            navigate(`/app/${createdConversation.id}`)
        } catch (e) {
            setError(e)
            setIsErrorDialogOpen(true)
            return
        }
    }

    return (
        <div className="flex justify-between gap-1">
            <SearchUser userBtnOnClick={(e, user) => {
                newConversation(user.id)
            }} />
            <NewGroupButton />
            <Dialog
                content={
                    <>
                        <p>{t("error_occurred")}:</p>
                        <ErrorMessage message={getError(error)} type="box" />
                    </>
                }
                isDisplayed={isErrorDialogOpen}
                setIsDisplayed={setIsErrorDialogOpen}
            />
        </div>
    )
}

export default NewConversationBar