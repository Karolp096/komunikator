import { Plus } from "lucide-react"
import Button from "./Button"
import Form from "./Form"
import SearchUser from "./SearchUser"
import TextField from "./TextField"
import ModifiableUserList from "./ModifiableUserList"
import { useContext, useState } from "react"
import { UserAuthContext } from "../contexts/UserAuthContext"
import { useNavigate } from "react-router-dom"
import ConversationContext from "../contexts/ConversationContext"
import AppConnectionSocketContext from "../contexts/AppConnectionSocketContext"
import { useTranslation } from "react-i18next"

const NewGroup = ({setDialogDisplayed}) => {
    const [groupUsers, setGroupUsers] = useState([])
    const [error, setError] = useState("")
    const [groupName, setGroupName] = useState("")
    const { user } = useContext(UserAuthContext)
    const navigate = useNavigate()
    const { setConversations } = useContext(ConversationContext)
    const { socket } = useContext(AppConnectionSocketContext)
    const backendUrl = import.meta.env.VITE_SERVER_URL

    const { t } = useTranslation()

    async function createGroup() {
        if(groupUsers.length < 2) {
            setError(t("err_group_users"))
            return
        }
        if(groupName.length <= 0) {
            setError(t("err_group_name"))
            return
        }
        if(error.length != 0) {
            setError("")
        }
        const userIds = groupUsers.map(usr => usr.id)
        userIds.push(user.id)
        const res = await fetch(`${backendUrl}/conversation`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: groupName,
                users: userIds
            })
        })
        if(!res.ok) {
            let errorToThrow = ""
            switch(res.status) {
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
                        errorToThrow = `${res.status} ${res.statusText}`
                        break
            }
            setError(errorToThrow)
            return
        }
        const json = await res.json()
        setConversations(c => [json, ...c])
        if(setDialogDisplayed) {
            setDialogDisplayed(false)
        }
        navigate(`/app/${json.id}`)
        socket.emit('new-conversation-notification', {
            userIds: userIds,
            conversation: json
        })
    }

    return (
        <Form
            error={error}
            onSubmit={() => {
                createGroup()
            }}
        >
            <TextField
                id="groupName"
                name="groupName"
                displayedName={t("group_name")}
                setState={setGroupName}
            />
            <SearchUser
                userBtnOnClick={(e, user) => {
                    setGroupUsers(usrs => {
                        const filter = usrs.filter(u => u.id == user.id)
                        if (filter.length > 0) {
                            return usrs
                        }
                        return [...usrs, user]
                    })
                }}
            />
            <p>{t("users_in_group")}:</p>
            <ModifiableUserList list={groupUsers} setList={setGroupUsers} />
            <Button type="submit" className="gap-2"><Plus /> {t("create")}</Button>
        </Form>
    )
}

export default NewGroup