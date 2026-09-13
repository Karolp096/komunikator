import { useContext } from "react"
import { UserAuthContext } from "./contexts/UserAuthContext"
import { Navigate, Outlet } from "react-router-dom"
import { Loader2 } from "lucide-react"

const PrivateRoute = () => {
    const { user, isLoading } = useContext(UserAuthContext)
  return (
    isLoading ? <Loader2 className="animate-spin text-blue-500" size="2.5em" /> : (
      user ? <Outlet /> : <Navigate to="/login" />
    )
  )
}

export default PrivateRoute