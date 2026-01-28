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
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Signup Error Response:', text);
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || 'Signup failed');
                } catch (e) {
                    throw new Error(`Signup failed (Raw: ${text.substring(0, 100)})`);
                }
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
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Login Error Response:', text);
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || 'Login failed');
                } catch (e) {
                    throw new Error(`Login failed (Raw: ${text.substring(0, 100)})`);
                }
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

    const updateProfile = async (updates) => {
        try {
            const token = getToken();
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Profile update failed');
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('pastel_user', JSON.stringify(data.user));
            if (data.token) {
                localStorage.setItem('pastel_token', data.token);
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        getToken,
        updateProfile,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
