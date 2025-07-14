'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Paper, Stack } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function parseJwt(token: string): { id: number; username: string } {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    );
    return JSON.parse(jsonPayload);
}

export default function LoginPage() {
    const { setUser } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                username,
                password
            });
            const token = res.data.token;
            const payload = parseJwt(token);

            setUser({
                id: payload.id,
                username: payload.username,
                token
            });
            router.push('/products');
        } catch (err: any) {
            console.error(err);
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Paper elevation={3} className="p-default max-w-md w-full rounded-xl">
                <Typography variant="h5" className="mb-default text-bold text-centered">Login</Typography>

                {error && <Alert severity="error" className="mb-default">{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}