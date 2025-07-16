'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Stack, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { parseJwt } from '@/utils/auth';

export default function LoginForm({
    onLoginSuccess,
}: {
    onLoginSuccess: (user: { id: number; username: string; token: string }) => void;
}) {
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
                password,
            });
            const token = res.data.token;
            const payload = parseJwt(token);

            onLoginSuccess({
                id: payload.id,
                username: payload.username,
                token,
            });
        } catch (err: any) {
            console.error(err);
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
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
    );
}
