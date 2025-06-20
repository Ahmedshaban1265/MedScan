import { Navigate } from 'react-router-dom'
import { useAuth } from '../Auth/AuthProvider'

const PrivateRoute = ({ children }) => {
    const { auth, isLoading } = useAuth()

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Only redirect to login if not loading and not authenticated
    return auth ? children : <Navigate to="/login" />
}

export default PrivateRoute
