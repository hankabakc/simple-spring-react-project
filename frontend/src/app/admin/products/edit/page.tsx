'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Product, Category } from '@/types/Type';

export default function EditProductPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [explanation, setExplanation] = useState('');
    const [categoryId, setCategoryId] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const productRes = await api.get<Product>(`/api/products/detail`, {
                    params: { id },
                });
                const productData = productRes.data;
                setProduct(productData);
                setName(productData.name);
                setPrice(productData.price);
                setExplanation(productData.explanation);
                setCategoryId(
                    categories.find((c) => c.name === productData.categoryName)?.id || 0
                );
            } catch (err) {
                console.error(err);
                setError('Ürün verisi alınamadı.');
            } finally {
                setLoading(false);
            }
        };

        api.get<Category[]>('/api/categories')
            .then((res) => setCategories(res.data))
            .catch(() => setCategories([]))
            .finally(() => {
                fetchData();
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('name', name);
            formData.append('price', price.toString());
            formData.append('explanation', explanation);
            formData.append('categoryId', categoryId.toString());
            if (image) formData.append('image', image); // opsiyonel olarak ekle

            await api.put('/api/admin/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.push('/admin/products');
        } catch (err) {
            console.error(err);
            setError('Ürün güncellenemedi.');
        } finally {
            setLoading(false);
        }
    };

    if (!id) {
        return <Alert severity="error">Geçersiz ürün ID</Alert>;
    }

    return (
        <Box className="p-8 flex justify-center">
            <Paper elevation={3} className="p-6 w-full max-w-xl">
                <Typography variant="h6" className="mb-4 font-bold">Ürünü Güncelle</Typography>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <CircularProgress />
                    </div>
                ) : (
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
                                {categories.map((cat) => (
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
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                className="btn-primary"
                            >
                                Güncelle
                            </Button>
                        </Stack>
                    </form>
                )}
            </Paper>
        </Box>
    );
}
