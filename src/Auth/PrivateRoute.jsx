import { Navigate } from 'react-router-dom'
import { useAuth } from '../Auth/AuthProvider'

const PrivateRoute = ({ children }) => {
    const { auth, isLoading } = useAuth()

    if (isLoading) {
        return <div className="text-center p-10 text-lg">Loading...</div> // أو سبينر
    }

    return auth ? children : <Navigate to="/login" />
}

export default PrivateRoute
