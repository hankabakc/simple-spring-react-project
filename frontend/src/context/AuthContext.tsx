'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/Type';
import { AuthContextType } from '@/types/Type';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const setUser = (user: User) => {
        setUserState(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setUserState(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
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
