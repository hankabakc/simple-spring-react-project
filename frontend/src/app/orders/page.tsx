'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { OrderResponse } from '@/types/Type';
import {
    Typography, Snackbar, Alert, Collapse, Divider
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[][]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const fetchOrders = async () => {
        const response = await api.get('/api/orders/my');

        // Siparişleri grupluyoruz: Aynı order.id olanlar bir gruba
        const grouped: Record<number, OrderResponse[]> = {};
        for (const item of response.data) {
            if (!grouped[item.orderId]) grouped[item.orderId] = [];
            grouped[item.orderId].push(item);
        }
        setOrders(Object.values(grouped));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleOrder = (orderId: number) => {
        setExpandedOrderId(prev => (prev === orderId ? null : orderId));
    };

    return (
        <div className="p-6 space-y-6">
            <Typography variant="h5">🧾 Sipariş Geçmişi</Typography>

            {orders.length === 0 ? (
                <p>Henüz siparişiniz yok.</p>
            ) : (
                orders.map((orderGroup) => {
                    const orderId = orderGroup[0].orderId;
                    const isOpen = expandedOrderId === orderId;

                    return (
                        <div
                            key={orderId}
                            className="border rounded-lg p-4 shadow hover:bg-gray-50 cursor-pointer transition"
                            onClick={() => toggleOrder(orderId)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">Sipariş ID: {orderId}</p>
                                    <p className="text-sm text-gray-500">Ürün Sayısı: {orderGroup.length}</p>
                                </div>
                                {isOpen ? <ExpandLess /> : <ExpandMore />}
                            </div>

                            <Collapse in={isOpen}>
                                <Divider className="my-3" />
                                <div className="space-y-2">
                                    {orderGroup.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span>{item.productName} × {item.quantity}</span>
                                            <span>{item.totalPrice} ₺</span>
                                        </div>
                                    ))}
                                </div>
                            </Collapse>
                        </div>
                    );
                })
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