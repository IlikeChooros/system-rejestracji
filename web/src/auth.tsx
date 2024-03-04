import React, { useEffect } from "react";
import { client } from "./clients/clients";


interface Auth {
    isAuthenticated: boolean;
    token: string;
    errors: string;
    login: (username: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => void;
}


const AuthContext = React.createContext<Auth>({
    isAuthenticated: false,
    token: "",
    errors: "",
    login: async () => Promise.resolve(false),
    logout: async () => {}
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<any> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [token, setToken] = React.useState("");
    const [errors, setErrors] = React.useState("");

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            setToken(token);
            setIsAuthenticated(true);
            console.log("token loaded", token);
        }
    }, []);

    const login = async (username: string, password: string, remember: boolean) => {
        let returns = false;
        try{
            const response = await client.post("/login", { username, password });
            setToken(response.data.token);
            setIsAuthenticated(true);
            if (remember){
                localStorage.setItem("auth_token", response.data.token);
                console.log("token saved", response.data.token);
            }
            setErrors("");
            returns = true;
        }
        catch (e) {
            let message = "An error occurred";
            if (e.response.data?.details) {
                message = e.response.data.details;
            }
            setErrors(message);
        }
        return returns;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken("");
        localStorage.removeItem("auth_token");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, errors, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
