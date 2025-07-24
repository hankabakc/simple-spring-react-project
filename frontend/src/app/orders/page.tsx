'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Typography,
    Snackbar,
    Alert,
    Collapse,
    Divider,
    IconButton,
    Paper,
    Box,
    Stack,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { OrderResponse } from '@/types/Type';
import Navbar from '@/components/Navbar';

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[][]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/orders');
            const grouped: Record<number, OrderResponse[]> = {};
            for (const item of response.data) {
                if (!grouped[item.orderId]) grouped[item.orderId] = [];
                grouped[item.orderId].push(item);
            }
            setOrders(Object.values(grouped));
        } catch (err) {
            console.error('Siparişler alınamadı:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleOrder = (orderId: number) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    const noop = () => { };

    return (
        <>
            <Navbar search="" onSearchChange={noop} onSearchSubmit={noop} />

            <Box className="p-6 space-y-6">
                <Typography variant="h5">🧾 Sipariş Geçmişi</Typography>

                {orders.length === 0 ? (
                    <Typography variant="body2" className="text-gray-500">
                        Henüz siparişiniz yok.
                    </Typography>
                ) : (
                    orders.map((orderGroup) => {
                        const orderId = orderGroup[0].orderId;
                        const isOpen = expandedOrderId === orderId;

                        return (
                            <Paper
                                key={orderId}
                                className="p-4 rounded-lg border shadow hover:bg-gray-50 cursor-pointer transition"
                                elevation={1}
                                onClick={() => toggleOrder(orderId)}
                            >
                                <Box className="flex items-center justify-between">
                                    <Box>
                                        <Typography variant="subtitle1" className="font-semibold">
                                            Sipariş ID: {orderId}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            Ürün Sayısı: {orderGroup.length}
                                        </Typography>
                                    </Box>
                                    <IconButton size="small">
                                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Box>

                                <Collapse in={isOpen}>
                                    <Divider className="my-3" />
                                    <Stack spacing={1}>
                                        {orderGroup.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                className="flex justify-between text-sm text-gray-800"
                                            >
                                                <span>
                                                    {item.productName} × {item.quantity}
                                                </span>
                                                <span>{item.totalPrice} ₺</span>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Collapse>
                            </Paper>
                        );
                    })
                )}

                <Snackbar
                    open={successOpen}
                    autoHideDuration={3000}
                    onClose={() => setSuccessOpen(false)}
                >
                    <Alert
                        severity="success"
                        variant="filled"
                        onClose={() => setSuccessOpen(false)}
                    >
                        Sipariş başarıyla oluşturuldu!
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}
