'use client';

import { useState } from 'react';
import { TextField, Button, Stack, Alert, CircularProgress } from '@mui/material';
import useApiState from '@/hooks/useApiState';
import { loginUser } from '@/services/authService';
import { LoginFormProps } from '@/types/Type';



export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading, error, execute } = useApiState();

    const handleSubmit = async () => {
        const result = await execute(() => loginUser({ email, password }));

        if (result.success && result.data) {
            onLoginSuccess(result.data);
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
            >
                {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
        </Stack>
    );
}
