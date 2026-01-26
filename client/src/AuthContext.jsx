import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('pastel_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('pastel_user');
            }
        }
        setLoading(false);
    }, []);

    const signup = async (email, password, name) => {
        try {
            const response = await fetch('http://localhost:3456/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Signup failed');
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('pastel_user', JSON.stringify(data.user));
            localStorage.setItem('pastel_token', data.token);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3456/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('pastel_user', JSON.stringify(data.user));
            localStorage.setItem('pastel_token', data.token);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pastel_user');
        localStorage.removeItem('pastel_token');
    };

    const getToken = () => {
        return localStorage.getItem('pastel_token');
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        getToken,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
