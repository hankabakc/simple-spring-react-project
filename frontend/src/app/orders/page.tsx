'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { OrderRequest, OrderResponse, CartItemResponse } from '@/types/Type';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Button, Snackbar, Alert, Typography
} from '@mui/material';

export default function OrdersPage() {
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [successOpen, setSuccessOpen] = useState(false);

    const fetchCart = async () => {
        const response = await api.get('/cart');
        setCartItems(response.data);
    };

    const fetchOrders = async () => {
        const response = await api.get('/orders/my');
        setOrders(response.data);
    };

    const createOrder = async () => {
        for (const item of cartItems) {
            const request: OrderRequest = {
                name: item.productName,
                price: item.productPrice,
                quantity: item.quantity,
            };
            await api.post('/orders', request);
        }

        await api.delete('/cart');
        setCartItems([]);
        setSuccessOpen(true);
        fetchOrders();
    };

    useEffect(() => {
        fetchCart();
        fetchOrders();
    }, []);

    return (
        <div className="p-6 space-y-8">
            <Typography variant="h5">🛒 Sepetteki Ürünler</Typography>

            {cartItems.length === 0 ? (
                <p>Sepetiniz boş.</p>
            ) : (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ürün</TableCell>
                                <TableCell>Adet</TableCell>
                                <TableCell>Fiyat</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems.map((item) => (
                                <TableRow key={item.productId}>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.productPrice} ₺</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button variant="contained" onClick={createOrder} className="mt-4">
                        Siparişi Tamamla
                    </Button>
                </>
            )}

            <Typography variant="h5" className="mt-10">🧾 Sipariş Geçmişi</Typography>

            {orders.length === 0 ? (
                <p>Henüz siparişiniz yok.</p>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ürün</TableCell>
                            <TableCell>Adet</TableCell>
                            <TableCell>Fiyat</TableCell>
                            <TableCell>Toplam</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.productName}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.price} ₺</TableCell>
                                <TableCell>{order.totalPrice} ₺</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
            >
                <Alert severity="success" variant="filled" onClose={() => setSuccessOpen(false)}>
                    Sipariş başarıyla oluşturuldu!
                </Alert>
            </Snackbar>
        </div>
    );
}
