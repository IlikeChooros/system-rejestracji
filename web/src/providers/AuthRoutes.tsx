import React from "react";
import { useAuth } from "../auth.tsx";
import { Navigate, useLocation } from "react-router-dom";


export const ProtectedRoute: React.FC<any> = ({ children }) => {
    const {state} = useLocation();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated || state?.from === "/login") {
        return <>{children}</>;
    }
    return <Navigate to="/login" />;
};