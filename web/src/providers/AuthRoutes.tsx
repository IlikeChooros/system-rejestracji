import React from "react";
import { useAuth } from "../auth.tsx";
import { Navigate, useLocation } from "react-router-dom";


export const ProtectedRoute: React.FC<any> = ({ children }) => {
    const {state} = useLocation();
    const { isAuthenticated } = useAuth();

    const isAllowed = React.useMemo(() => {
        return isAuthenticated || state?.from === "/login";
    }, [isAuthenticated]);

    if (isAllowed) {
        return <>{children}</>;
    }
    return <Navigate to="/login" />;
};