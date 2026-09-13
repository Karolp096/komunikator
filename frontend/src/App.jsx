import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MainPage from "./pages/MainPage"
import UserAuthProvider from "./contexts/UserAuthProvider"
import PrivateRoute from "./PrivateRoute"
import LoginPage from "./pages/LoginPage"
import LogoutPage from "./pages/LogoutPage"
import { CookiesProvider } from "react-cookie"
import RegisterPage from "./pages/RegisterPage"
import ChatPage from "./pages/ChatPage"
import { useEffect, useState } from "react"

const App = () => {
  const defaultStyles = "flex flex-col gap-5 p-4 w-screen h-screen relative dark:bg-neutral-900 dark:text-white"
  const [colourScheme, setColourScheme] = useState("")

  const checkDarkMode = () => {
    const scheme = localStorage.getItem("colourScheme")
    if(scheme === "dark") {
      setColourScheme("dark")
      return
    }
    if(scheme === null && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setColourScheme("dark")
      return
    }
  }

  useEffect(checkDarkMode, [])

  return (
    <CookiesProvider>
      <UserAuthProvider>
        <div className={defaultStyles + " " + colourScheme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/logout" element={<LogoutPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/app" element={<MainPage />}>
                  <Route path=":id" element={<ChatPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </UserAuthProvider>
    </CookiesProvider>
  )
}

export default App