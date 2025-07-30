'use client';

import React, { useState } from 'react';
import {
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import useApiState from '@/hooks/useApiState';
import { registerUser } from '@/services/authService';
import { RegisterFormProps, RegisterRequest, RegisterResponse } from '@/types/Type';

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
    const { loading, error, execute } = useApiState<RegisterResponse>();
    const [form, setForm] = useState<RegisterRequest>({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await execute(() => registerUser(form));
        if (result.success) {
            onRegisterSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
                label="Username"
                name="username"
                fullWidth
                value={form.username}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={form.email}
                onChange={handleChange}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={form.password}
                onChange={handleChange}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
        </form>
    );
}
