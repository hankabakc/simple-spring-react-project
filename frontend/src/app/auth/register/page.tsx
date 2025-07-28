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
import { RegisterFormProps } from '@/types/Type';

;

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
    const { loading, error, execute } = useApiState<void>();
    const [form, setForm] = useState({
        name: '',
        surname: '',
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
                label="Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
            />
            <TextField
                label="Surname"
                name="surname"
                fullWidth
                value={form.surname}
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
