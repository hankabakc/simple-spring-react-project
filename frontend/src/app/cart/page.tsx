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

type CartPageProps = {
    userId: number;
};

export default function CartPage({ userId }: CartPageProps) {
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCart();
    }, [userId]);

    const fetchCart = () => {
        setLoading(true);
        axios
            .get<CartItemResponse[]>('/api/cart', { params: { userId } })
            .then(res => setCartItems(res.data))
            .catch(() => setError('Sepet yüklenemedi. Lütfen daha sonra tekrar deneyin.'))
            .finally(() => setLoading(false));
    };

    const removeItem = (productId: number) => {
        axios
            .delete('/api/cart/item', { params: { userId, productId } })
            .then(() => fetchCart())
            .catch(() => setError('Ürün silinirken hata oluştu.'));
    };

    const clearCart = () => {
        axios
            .delete('/api/cart', { params: { userId } })
            .then(() => fetchCart())
            .catch(() => setError('Sepet temizlenirken hata oluştu.'));
    };

    if (!userId) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Alert severity="error">❗ Kullanıcı girişi gerekiyor. userId yok.</Alert>
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
            <Typography variant="h4" className="mb-4 text-center font-bold">Sepetim</Typography>

            {cartItems.length === 0 ? (
                <Alert severity="info">Sepetiniz boş.</Alert>
            ) : (
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        {cartItems.map((item) => (
                            <Grid key={item.productId}>
                                <Card className="shadow-lg rounded-lg">
                                    <CardMedia
                                        component="img"
                                        image={`data:image/png;base64,${item.productImage}`}
                                        alt={item.productName}
                                        className="h-48 object-cover"
                                    />
                                    <CardContent className="flex flex-col space-y-2">
                                        <Typography variant="h6" className="font-semibold">{item.productName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fiyat: ₺{item.productPrice}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
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

                    <Divider className="my-4" />

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
