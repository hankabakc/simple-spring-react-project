'use client';

import { useRouter } from 'next/navigation';
import { Box, Paper, Stack, Button } from '@mui/material';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const router = useRouter();

    const handleLoginSuccess = (userData: any) => {
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/');
    };

    return (
        <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Paper elevation={3} className="p-default max-w-md w-full rounded-xl">
                <Stack spacing={2}>
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={() => router.push('/auth/register')}
                    >
                        Don't have an account? Register
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
