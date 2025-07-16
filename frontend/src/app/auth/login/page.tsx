'use client';

import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const { setUser } = useAuth();
    const router = useRouter();

    const handleLoginSuccess = (user: { id: number; username: string; token: string }) => {
        setUser(user);
        router.push('/products');
    };

    return (
        <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Paper elevation={3} className="p-default max-w-md w-full rounded-xl">
                <Typography variant="h5" className="mb-default text-bold text-centered">
                    Login
                </Typography>
                <LoginForm onLoginSuccess={handleLoginSuccess} />
                <Button
                    variant="text"
                    color="secondary"
                    onClick={() => router.push('/auth/register')}
                    className="mt-default"
                >
                    Don’t have an account? Register
                </Button>
            </Paper>
        </Box>
    );
}
