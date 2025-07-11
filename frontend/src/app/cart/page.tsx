'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    CircularProgress,
    Alert,
    Divider,
    Stack
} from '@mui/material';

type CartItemResponse = {
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};

export default function CartPage() {
    // Sabit userId
    const userId = 2;

    // State
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Sepeti çek
    const fetchCart = () => {
        setLoading(true);
        axios
            .get(`http://localhost:3000/cart?userId=2`)
            .then(res => setCartItems(res.data.items ?? []))
            .catch(() => setError('Sepet yüklenemedi. Lütfen daha sonra tekrar deneyin.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Ürün sil
    const removeItem = (productId: number) => {
        axios
            .delete(`http://localhost:3000/cart/item?userId=2&productId=${productId}`)
            .then(() => fetchCart())
            .catch(() => setError('Ürün silinirken hata oluştu.'));
    };

    // Sepeti temizle
    const clearCart = () => {
        axios
            .delete(`http://localhost:3000/cart?userId=2`)
            .then(() => fetchCart())
            .catch(() => setError('Sepet temizlenirken hata oluştu.'));
    };

    // Kullanıcı yok kontrolü (hardcoded userId olduğu için gerek yok ama isteğe bağlı)
    if (!userId) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Alert severity="error">❗ Kullanıcı girişi gerekiyor. userId yok.</Alert>
            </Box>
        );
    }

    // Loading state
    if (loading) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    // Main render
    return (
        <Box className="max-w-5xl mx-auto p-4">
            <Typography variant="h4" className="mb-4 text-center font-bold text-gray-200">
                Sepetim
            </Typography>

            {cartItems.length === 0 ? (
                <Alert severity="info">Sepetiniz boş.</Alert>
            ) : (
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        {cartItems.map((item) => (
                            <Grid key={item.productId}>
                                <Card className="shadow-lg rounded-lg bg-purple-950 border border-blue-500">
                                    <CardMedia
                                        component="img"
                                        image={`data:image/png;base64,${item.productImage}`}
                                        alt={item.productName}
                                        className="h-48 object-cover"
                                    />
                                    <CardContent className="flex flex-col space-y-2 text-gray-200">
                                        <Typography variant="h6" className="font-semibold text-center">
                                            {item.productName}
                                        </Typography>
                                        <Typography variant="body2" className="text-center text-gray-300">
                                            Fiyat: ₺{item.productPrice}
                                        </Typography>
                                        <Typography variant="body2" className="text-center text-gray-300">
                                            Adet: {item.quantity}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeItem(item.productId)}
                                            className="mt-2"
                                        >
                                            Ürünü Kaldır
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Divider className="my-4 border-blue-500" />
                    <Box className="flex justify-end">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={clearCart}
                            className="hover:bg-red-700"
                        >
                            Sepeti Temizle
                        </Button>
                    </Box>
                </Stack>
            )}
        </Box>
    );
}
