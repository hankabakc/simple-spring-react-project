'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/Type';
import { AuthContextType } from '@/types/Type';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
