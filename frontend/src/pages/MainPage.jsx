import { useContext, useEffect, useMemo, useState } from "react"
import { Outlet } from "react-router-dom"
import { io } from "socket.io-client"
import { UserAuthContext } from "../contexts/UserAuthContext"
import AppConnectionSocketContext from "../contexts/AppConnectionSocketContext"
import Conversations from "../components/Conversations"
import Button from "../components/Button"
import { Menu } from "lucide-react"
import ConversationProvider from "../contexts/ConversationProvider"
import { useTranslation } from "react-i18next"
import NewConversationBar from "../components/NewConversationBar"
import UserMenuButton from "../components/UserMenuButton"

const MainPage = () => {
  const { user } = useContext(UserAuthContext)
  const backendUrl = import.meta.env.VITE_SERVER_URL
  const [socket, setSocket] = useState(() => (
    io(backendUrl, {
      extraHeaders: {
        Authorization: `Bearer ${user.accessToken}`
      }
    })
  ))
  const [sideMenuVisibility, setSideMenuVisibility] = useState(false)
  const [sideMenuVisibiltyStyle, setSideMenuVisibiltyStyle] = useState("hidden md:flex")

  const { t } = useTranslation()

  useEffect(() => {
    return () => {
      if(socket == null) {
        return
      }
      socket.disconnect()
    }
  }, [socket])

  const contextValues = useMemo(() => ({socket}), [socket])
  
  return (
    <AppConnectionSocketContext.Provider value={contextValues}>
      <ConversationProvider>
        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              setSideMenuVisibility(v => {
                if(v) {
                  setSideMenuVisibiltyStyle("hidden md:flex")
                } else {
                  setSideMenuVisibiltyStyle("flex md:hidden")
                }
                return !v
              })
            }}
          >
            <Menu />
          </Button>
          <UserMenuButton />
        </div>
        <main className="flex flex-1 overflow-hidden">
          <section className={"flex-1 md:flex-1 flex-col p-2 gap-2" + " " + sideMenuVisibiltyStyle}>
            <NewConversationBar />
            <Conversations />
          </section>
          <section className={"md:flex flex-col p-2 flex-1 md:flex-[2.4] gap-3 " + (sideMenuVisibility ? "hidden" : "flex")}>
            <Outlet />
          </section>
        </main>
      </ConversationProvider>
    </AppConnectionSocketContext.Provider>
  )
}

export default MainPage