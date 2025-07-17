'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableContainer,
    Typography,
    Avatar,
    CircularProgress
} from '@mui/material';
import { Product } from '@/types/Type';

export default function AdminProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get<Product[]>('/api/admin/products');
                setProducts(res.data);
            } catch (error) {
                console.error('Ürünler alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmed = confirm('Bu ürünü silmek istediğine emin misin?');
        if (!confirmed) return;

        try {
            await api.delete('/api/admin/products', {
                params: { id },
            });
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Silme işlemi başarısız:', error);
            alert('Ürün silinemedi.');
        }
    };

    return (
        <div className="p-8">
            <Typography variant="h5" className="mb-4 font-bold">
                Ürün Listesi
            </Typography>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <CircularProgress />
                </div>
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
                            {products.map((product) => (
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
                                    <TableCell>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-800 font-semibold transition"
                                        >
                                            Sil
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
