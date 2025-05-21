import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { UserRole } from "../../constant/roles";

const RoleBasedRoute = ({children, allowedRoles}) => {
    const {user, isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default RoleBasedRoute