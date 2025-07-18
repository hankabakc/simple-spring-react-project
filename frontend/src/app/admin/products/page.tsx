// components/AdminProductList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import {
    Box,
    Stack,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableContainer,
    Typography,
    Avatar,
    CircularProgress,
    TextField,
    MenuItem,
    Button,
    InputLabel,
    FormControl,
    Select,
} from '@mui/material';
import { Product, Category } from '@/types/Type';

export default function AdminProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get<Product[]>('/api/admin/products'),
                    api.get<Category[]>('/api/categories'),
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Veriler alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategories();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params: { search?: string; categoryIds?: number[] | string } = {};

            if (search) {
                params.search = search;
            }

            if (selectedCategoryIds.length > 0) {
                params.categoryIds = selectedCategoryIds;

            }

            const res = await api.get<Product[]>('/api/admin/products/search', { params });
            setProducts(res.data);
        } catch (err) {
            console.error('Arama veya filtreleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = confirm('Bu ürünü silmek istediğine emin misin?');
        if (!confirmed) return;

        try {
            await api.delete(`/api/admin/products`, {
                params: { id },
            });
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Silme işlemi başarısız:', error);
            alert('Ürün silinemedi.');
        }
    };

    return (
        <Box p={8}>
            <Typography variant="h5" mb={4} fontWeight="bold">
                Ürün Listesi
            </Typography>

            <Stack direction="row" spacing={2} mb={6} className="items-center">
                <TextField
                    label="Ürün Ara"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                />


                <FormControl className="w-64">
                    <InputLabel id="category-select-label">Kategori Seç</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        multiple
                        value={selectedCategoryIds}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedCategoryIds(value as unknown as number[]);
                        }}
                        variant="outlined"
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleSearch}>
                    Ara
                </Button>
                <Button
                    variant="outlined"
                    component={Link}
                    href="/admin/products/add"
                >
                    Yeni Ürün Ekle
                </Button>
            </Stack>

            {loading ? (
                <Box className="flex justify-center items-center h-40">
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} className="shadow-md rounded-lg">
                    <Table>
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>İsim</strong></TableCell>
                                <TableCell><strong>Açıklama</strong></TableCell>
                                <TableCell><strong>Fiyat</strong></TableCell>
                                <TableCell><strong>Kategori</strong></TableCell>
                                <TableCell><strong>Resim</strong></TableCell>
                                <TableCell><strong>İşlemler</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        Hiç ürün bulunamadı.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.explanation}</TableCell>
                                        <TableCell>{product.price} ₺</TableCell>
                                        <TableCell>{product.categoryName}</TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={`data:image/jpeg;base64,${product.base64Image}`}
                                                variant="rounded"
                                                className="w-16 h-16"
                                            />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <Link
                                                href={`/admin/products/edit?id=${product.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-semibold transition mr-4"
                                            >
                                                Düzenle
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold transition"
                                            >
                                                Sil
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}