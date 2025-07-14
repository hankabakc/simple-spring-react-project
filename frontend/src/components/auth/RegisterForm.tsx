'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Stack } from '@mui/material';

type RegisterFormProps = {
    onRegisterSuccess: (token: string) => void;
};

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // 1️⃣ Register isteği
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
                username,
                email,
                password
            });

            // 2️⃣ Register başarılı → Şimdi otomatik login yap
            const loginRes = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                username,
                password
            });

            const token = loginRes.data.token;
            if (token) {
                onRegisterSuccess(token);
            } else {
                setError('Login after registration succeeded but no token returned.');
            }
        } catch (err: any) {
            console.error(err);
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="p-4">
            <Typography variant="h5" className="mb-default text-bold text-centered">
                Register
            </Typography>

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
                        label="Email"
                        variant="outlined"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
