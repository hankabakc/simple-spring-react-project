'use client';

import { useState } from 'react';
import {
    TextField,
    Button,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';
import useApiState from '@/hooks/useApiState';
import { loginUser } from '@/services/authService';
import { LoginFormProps, LoginResponse } from '@/types/Type';
import { useAuth } from '@/context/AuthContext';
import { parseJwt } from '@/utils/authUtils';

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loading, error, execute } = useApiState<LoginResponse>();
    const { setUser } = useAuth();

    const handleSubmit = async () => {
        const result = await execute(() => loginUser({ username, password }));

        if (result.success && result.data) {
            const payload = parseJwt(result.data.token);

            setUser({
                id: payload.id,
                username: payload.username,
                token: result.data.token,
                role: payload.role as 'ADMIN' | 'USER',
            });

            onLoginSuccess(result.data);
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
