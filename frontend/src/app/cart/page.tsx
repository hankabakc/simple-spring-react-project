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
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';

type CartItemResponse = {
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};

export default function CartPage() {
    const { user } = useAuth();
    const { getCart, addToCart, deleteFromCart, clearCart: clearCartHook } = useCart(user?.token || '');

    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        if (!user?.token) {
            setError('Sepeti görüntülemek için giriş yapmalısınız.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getCart();
            setCartItems(data);
        } catch (err: any) {
            console.error('Sepet yüklenirken hata oluştu:', err.response?.data || err.message || err);
            setError('Sepet yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user?.token]);

    const removeItem = async (productId: number) => {
        if (!user?.token) return;
        try {
            await deleteFromCart(productId);
            fetchCart();
        } catch (err: any) {
            console.error('Ürün silinirken hata oluştu:', err.response?.data || err.message || err);
            setError('Ürün silinirken hata oluştu.');
        }
    };

    const clearCart = async () => {
        if (!user?.token) return;
        try {
            await clearCartHook();
            fetchCart();
        } catch (err: any) {
            console.error('Sepet temizlenirken hata oluştu:', err.response?.data || err.message || err);
            setError('Sepet temizlenirken hata oluştu.');
        }
    };

    if (!user) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Alert severity="error">❗ Sepeti görüntülemek için kullanıcı girişi gerekiyor.</Alert>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box className="max-w-5xl mx-auto p-4">
            <Typography variant="h4" className="mb-default text-bold text-centered text-primary">
                Sepetim
            </Typography>

            {cartItems.length === 0 ? (
                <Alert severity="info">Sepetiniz boş.</Alert>
            ) : (
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        {cartItems.map((item) => (
                            <Grid key={item.productId} >
                                <Card className="card-primary">
                                    <CardMedia
                                        component="img"
                                        image={`data:image/png;base64,${item.productImage}`}
                                        alt={item.productName}
                                        className="h-48 object-cover"
                                    />
                                    <CardContent className="flex flex-col space-y-2 text-primary">
                                        <Typography variant="h6" className="text-bold text-centered">
                                            {item.productName}
                                        </Typography>
                                        <Typography variant="body2" className="text-centered text-secondary">
                                            Fiyat: ₺{item.productPrice}
                                        </Typography>
                                        <Typography variant="body2" className="text-centered text-secondary">
                                            Adet: {item.quantity}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeItem(item.productId)}
                                            className="btn-outlined-error mt-2"
                                        >
                                            Ürünü Kaldır
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Divider className="my-4 divider-primary" />
                    <Box className="flex justify-end">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={clearCart}
                            className="btn-error"
                        >
                            Sepeti Temizle
                        </Button>
                    </Box>
                </Stack>
            )}
        </Box>
    );
}