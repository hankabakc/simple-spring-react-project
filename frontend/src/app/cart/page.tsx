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
import { useAuth } from '@/context/AuthContext'; // useAuth'ı import edin
import { useCart } from '@/hooks/useCart'; // useCart'ı import edin

type CartItemResponse = {
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};

export default function CartPage() {
    const { user } = useAuth(); // Kullanıcı bilgisini useAuth'tan alın
    const { getCart, addToCart, deleteFromCart, clearCart: clearCartHook } = useCart(user?.token || ''); // useCart hook'unu kullanın

    // State
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Sepeti çek
    const fetchCart = async () => {
        if (!user?.token) {
            setError('Sepeti görüntülemek için giriş yapmalısınız.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null); // Önceki hataları temizle
        try {
            const data = await getCart(); // useCart hook'undan getCart'ı kullan
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
    }, [user?.token]); // user.token değiştiğinde sepeti tekrar çek

    const removeItem = async (productId: number) => {
        if (!user?.token) return;
        try {
            await deleteFromCart(productId); // useCart hook'undan deleteFromCart'ı kullan
            fetchCart(); // Sepeti yeniden çek
        } catch (err: any) {
            console.error('Ürün silinirken hata oluştu:', err.response?.data || err.message || err);
            setError('Ürün silinirken hata oluştu.');
        }
    };

    const clearCart = async () => {
        if (!user?.token) return;
        try {
            await clearCartHook(); // useCart hook'undan clearCart'ı kullan
            fetchCart(); // Sepeti yeniden çek
        } catch (err: any) {
            console.error('Sepet temizlenirken hata oluştu:', err.response?.data || err.message || err);
            setError('Sepet temizlenirken hata oluştu.');
        }
    };

    if (!user) { // userId yerine user objesini kontrol edin
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Alert severity="error">❗ Sepeti görüntülemek için kullanıcı girişi gerekiyor.</Alert>
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
                            <Grid key={item.productId}> {/* Responsive grid ayarları */}
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
