// src/components/auth/LoginForm.tsx

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Stack } from '@mui/material';
import api from '@/services/api';
import { parseJwt } from '@/utils/auth';

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await api.post('/api/auth/login', {
                username,
                password
            });
            onLoginSuccess(res.data.token);
        } catch (err: any) {
            console.error(err);
            setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Typography variant="h5" className="mb-default text-bold text-centered">Login</Typography>
            {error && <Alert severity="error" className="mb-default">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Kullanıcı Adı"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Şifre"
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
                        {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
                    </Button>
                </Stack>
            </form>
        </>
    );
}