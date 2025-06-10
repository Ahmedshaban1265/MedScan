import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('userName'); // Changed 'userName' to 'user'
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setAuth(true); //If a user exists, then make authorized to True
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                localStorage.removeItem('userName');
                setUser(null);
                setAuth(false);
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setAuth(true); //Setting True here
        localStorage.setItem('userName',JSON.stringify(userData)); //Save in localStorage
    }

    const logOut = () => {
        console.log("Logging out, removing user from localStorage");
        localStorage.removeItem('userName'); //Use the same KEY from the local storage
        setUser(null);
        setAuth(false);
    }

    return (
        <AuthContext.Provider value={{ user, login, logOut, auth ,setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}