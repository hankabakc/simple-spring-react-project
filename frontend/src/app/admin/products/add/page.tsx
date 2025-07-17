'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Box,
    Button,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/Type';

export default function AddProductPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [explanation, setExplanation] = useState('');
    const [categoryId, setCategoryId] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<Category[]>('/api/categories')
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price.toString());
            formData.append('explanation', explanation);
            formData.append('categoryId', categoryId.toString());
            if (image) formData.append('image', image);

            await api.post('/api/admin/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.push('/admin/products');
        } catch (err) {
            console.error(err);
            setError('Ürün eklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="p-8 flex justify-center">
            <Paper elevation={3} className="p-6 w-full max-w-xl">
                <Typography variant="h6" className="mb-4 font-bold">Yeni Ürün Ekle</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Ürün Adı"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Fiyat"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            required
                        />
                        <TextField
                            label="Açıklama"
                            multiline
                            minRows={3}
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            required
                        />
                        <TextField
                            select
                            label="Kategori"
                            value={categoryId}
                            onChange={(e) => setCategoryId(Number(e.target.value))}
                            required
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setImage(file);
                            }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? <CircularProgress size={24} /> : 'Ekle'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
