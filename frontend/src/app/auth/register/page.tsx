// src/app/(auth)/register/page.tsx

'use client';

import React from 'react';
import { Box, Paper } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { parseJwt } from '@/utils/auth';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    const { setUser } = useAuth();

    const handleRegisterSuccess = (token: string) => {
        const payload = parseJwt(token);
        setUser({
            id: payload.id,
            username: payload.username,
            token
        });
        window.location.href = '/';
    };

    return (
        <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Paper elevation={3} className="p-default max-w-md w-full rounded-xl">
                <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            </Paper>
        </Box>
    );
}