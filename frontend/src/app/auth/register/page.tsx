'use client';

import React from 'react';
import { Box, Paper, Button, Stack } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { parseJwt } from '@/utils/auth';
import RegisterForm from '@/components/auth/RegisterForm';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { setUser } = useAuth();
    const router = useRouter();

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
                <Stack spacing={2}>
                    <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={() => router.push('/auth/login')}
                    >
                        Already have an account? Login
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
