'use client';

import { useRouter } from 'next/navigation';
import { Box, Paper, Typography } from '@mui/material';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    const router = useRouter();

    return (
        <Box className="min-h-screen flex items-center justify-center p-8">
            <Paper elevation={3} className="p-6 w-full max-w-md">
                <Typography variant="h6" className="mb-4 font-bold">
                    Register
                </Typography>
                <RegisterForm onRegisterSuccess={() => router.push('/auth/login')} />
            </Paper>
        </Box>
    );
}