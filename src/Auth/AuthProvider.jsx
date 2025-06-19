import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for stored authentication state on component mount
        const storedAuth = localStorage.getItem("auth");
        const storedUser = localStorage.getItem("userName");
        const storedRole = localStorage.getItem("userRole");

        if (storedAuth === "true" && storedUser) {
            setAuth(true);
            setUser({ ...JSON.parse(storedUser), role: storedRole });
        }
    }, []);

    const login = (userData, userRole) => {
        setUser({ ...userData, role: userRole });
        setAuth(true); //Setting True here
        localStorage.setItem("userName", JSON.stringify(userData)); //Save in localStorage
        localStorage.setItem("auth", "true"); // Save auth state
        localStorage.setItem("userRole", userRole); // Save userRole
    };

    const logOut = () => {
        setUser(null);
        setAuth(false);
        localStorage.removeItem("userName");
        localStorage.removeItem("auth");
        localStorage.removeItem("token"); // Also remove token on logout
        localStorage.removeItem("userRole"); // Also remove userRole on logout
    };

    return (
        <AuthContext.Provider value={{ auth, user, login, logOut, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


