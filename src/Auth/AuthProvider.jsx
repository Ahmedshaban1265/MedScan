import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        const storedUser = localStorage.getItem("userName");
        const storedRole = localStorage.getItem("userRole");

        if (storedAuth === "true" && storedUser) {
            setAuth(true);
            try {
                const userData = JSON.parse(storedUser);
                setUser({ ...userData, role: storedRole });
            } catch (error) {
                setUser({ userName: storedUser, role: storedRole });
            }
        }
        
        setIsLoading(false);
    }, []);

    const login = (userData, userRole) => {
        setUser({ ...userData, role: userRole });
        setAuth(true); 
        localStorage.setItem("userName", JSON.stringify(userData)); 
        localStorage.setItem("auth", "true"); 
        localStorage.setItem("userRole", userRole); 
    };

    const logOut = () => {
        setUser(null);
        setAuth(false);
        localStorage.removeItem("userName");
        localStorage.removeItem("auth");
        localStorage.removeItem("token"); 
        localStorage.removeItem("userRole"); 
    };

    return (
        <AuthContext.Provider value={{ auth, user, login, logOut, setAuth, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


