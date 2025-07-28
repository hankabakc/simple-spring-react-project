'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { registerUser } from '@/services/authService';
import useApiState from '@/hooks/useApiState';

export default function RegisterPage() {
    const router = useRouter();
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

    const handleSubmit = async () => {
        const result = await execute(() => registerUser(form));
        if (result.success) {
            router.push('/login');
        }
    };

    return (
        <Box className="p-8 flex justify-center">
            <Paper elevation={3} className="p-6 w-full max-w-md">
                <Typography variant="h6" className="mb-4 font-bold">
                    Register
                </Typography>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        label="First Name"
                        name="name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Last Name"
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
            </Paper>
        </Box>
    );
}
