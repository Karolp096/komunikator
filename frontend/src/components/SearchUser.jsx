import { useContext, useEffect, useRef, useState, useCallback } from "react"
import TextField from "./TextField"
import { Search } from "lucide-react"
import { useDebounce } from "use-debounce"
import { UserAuthContext } from "../contexts/UserAuthContext"
import Button from "./Button"
import { useNavigate } from "react-router-dom"
import ConversationContext from "../contexts/ConversationContext"
import { useTranslation } from "react-i18next"

const SearchUser = ({userBtnOnClick, withLabel, nameOnLabel}) => {
    const [isSearching, setIsSearching] = useState(false)
    const canBeBlurred = useRef(true)
    const [query, setQuery] = useState("")
    const [debouncedQuery] = useDebounce(query, 300)
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")

    const { user } = useContext(UserAuthContext)
    const navigate = useNavigate()

    const { setConversations } = useContext(ConversationContext)
    const searchField = useRef(null)

    const backendUrl = import.meta.env.VITE_SERVER_URL

    const { t } = useTranslation()


    function clearSearchField(field) {
        field.value = ""
        setQuery("")
    }

    const searchUser = useCallback(async () => {
        if(!debouncedQuery) {
            return
        }
        setUsers([])
        setError("")
        try {
            const res = await fetch(`${backendUrl}/user/${debouncedQuery}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
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
                    case 404:
                        errorToThrow = t("err_user_not_found")
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
            const usr = await res.json()
            setUsers(usr)
        } catch (e) {
            setError(e)
            return
        }
    }, [debouncedQuery, user.accessToken])

    function blurField() {
        canBeBlurred.current = true;
        setIsSearching(false)
        clearSearchField(searchField.current)
    }

    useEffect(() => {
        if(!isSearching) {
            return
        }
        searchUser()
    }, [isSearching, debouncedQuery, searchUser])

    return (
        <>
            <TextField
                type="search"
                withLabel={withLabel || false}
                displayedName={nameOnLabel || ""}
                wrapperClassName="relative z-1 flex-1"
                className="cursor-pointer focus:cursor-auto transition-none"
                onFocus={() => {
                    setIsSearching(true)
                }}
                onBlur={e => {
                    if(!canBeBlurred.current) {
                        e.preventDefault()
                        e.target.focus()
                        canBeBlurred.current = true
                        return
                    }
                    if((users.length > 0 && e.relatedTarget != null)) {
                        if(users.map(usr => usr.username).includes(e.relatedTarget.innerText)) {
                            e.preventDefault()
                            return
                        }
                    }
                    setIsSearching(false)
                    clearSearchField(e.target)
                }}
                setState={setQuery}
                fieldRef={searchField}
            >
                <div className="flex gap-2 absolute top-2.5 left-2 -z-1 text-neutral-400">
                    {query || (
                        <>
                        <Search />
                        <p className="select-none">{t("search_user")}</p>
                        </>
                    )}
                </div>
            
            {isSearching && (
                <>
                    <div
                        className=" flex
                                    flex-col
                                    absolute
                                    z-100
                                    top-full
                                    bg-white
                                    dark:bg-neutral-900
                                    w-full
                                    rounded-xl
                                    p-2
                                    border
                                    border-black
                                    dark:border-white
                                    overflow-auto"
                        role="button"
                        tabIndex={-1}
                        onMouseDown={() => {canBeBlurred.current = false}}
                    >
                        {
                            error ? (
                                <p>{error.toString().split("Error:")[1]}</p>
                            )
                            : debouncedQuery ? 
                                users.map((user) => (
                                    <Button
                                        key={user.id}
                                        intent="secondary"
                                        btnType="notRound"
                                        onClick={(e) => {
                                            userBtnOnClick(e, user)
                                            canBeBlurred.current = true
                                            setIsSearching(false)
                                            clearSearchField(searchField.current)
                                            searchField.current.blur()
                                        }}
                                        onBlur={e => {
                                            if(e.relatedTarget != null) {
                                                const usernameArray = users.map(usr => usr.username)
                                                const usernameSet = new Set(usernameArray)
                                                if(!usernameSet.has(e.relatedTarget.innerText)) {
                                                    blurField()
                                                    return
                                                }
                                            }
                                            if(e.relatedTarget == null) {
                                                blurField()
                                            }
                                        }}
                                    >
                                        {user.username}</Button>
                                ))
                            : (<p>{t("search_type_name")}</p>)
                        }
                    </div>
                </>
            )}
            </TextField>
            {isSearching && (
                <div className="absolute top-0 left-0 size-full bg-[#ffffffc3] dark:bg-[#19191992]"></div>
            )}
        </>
    )
}

export default SearchUser