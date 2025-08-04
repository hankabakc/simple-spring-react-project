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
    Container,
    Card,
    CardContent,
    Chip,
    Fade,
} from '@mui/material';
import { ExpandMore, ExpandLess, Receipt, ShoppingBag } from '@mui/icons-material';
import { OrderResponse } from '@/types/Type';
import Navbar from '@/components/Navbar';
import { groupOrders } from '@/utils/orderUtils';

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[][]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/orders');
            const grouped = groupOrders(response.data);
            setOrders(Object.values(grouped));
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleOrder = (orderId: number) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    const noop = () => { };

    // Toplam fiyatı hesapla
    const calculateOrderTotal = (orderGroup: OrderResponse[]) => {
        return orderGroup.reduce((total, item) => total + item.totalPrice, 0);
    };

    return (
        <>
            <Navbar search="" onSearchChange={noop} onSearchSubmit={noop} />

            <Box className="min-h-screen bg-blue-300">
                <Container maxWidth="lg" className="py-8">
                    {/* Header Section */}
                    <Box className="mb-8">
                        <Box className="flex items-center gap-3 mb-2">
                            <Receipt className="text-blue-600 text-3xl" />
                            <Typography
                                variant="h4"
                                className="font-bold text-gray-800"
                            >
                                Order History
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            className="text-gray-600"
                        >
                            Track your previous orders and view order details
                        </Typography>
                    </Box>

                    {orders.length === 0 ? (
                        <Card className="text-center py-16">
                            <CardContent>
                                <ShoppingBag className="text-gray-400 mb-4" style={{ fontSize: '4rem' }} />
                                <Typography
                                    variant="h6"
                                    className="text-gray-600 mb-2"
                                >
                                    No Orders Yet
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-gray-500"
                                >
                                    Your order history will appear here once you make your first purchase.
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Stack spacing={3}>
                            {orders.map((orderGroup, index) => {
                                const orderId = orderGroup[0].orderId;
                                const isOpen = expandedOrderId === orderId;
                                const orderTotal = calculateOrderTotal(orderGroup);

                                return (
                                    <Fade
                                        in={true}
                                        timeout={300 + index * 100}
                                        key={orderId}
                                    >
                                        <Card
                                            className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-l-4 border-l-blue-500"
                                            elevation={2}
                                            onClick={() => toggleOrder(orderId)}
                                        >
                                            <CardContent className="p-6">
                                                <Box className="flex items-center justify-between">
                                                    <Box className="flex-1">
                                                        <Box className="flex items-center gap-3 mb-3">
                                                            <Chip
                                                                label={`Order #${orderId}`}
                                                                color="primary"
                                                                variant="filled"
                                                                size="small"
                                                                className="font-semibold"
                                                            />
                                                            <Chip
                                                                label={`${orderGroup.length} items`}
                                                                variant="outlined"
                                                                size="small"
                                                                className="text-gray-600"
                                                            />
                                                        </Box>

                                                        <Typography
                                                            variant="h6"
                                                            className="font-bold text-green-600 mb-1"
                                                        >
                                                            {orderTotal} ₺
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            className="text-gray-500"
                                                        >
                                                            Click to {isOpen ? 'hide' : 'view'} order details
                                                        </Typography>
                                                    </Box>

                                                    <IconButton
                                                        size="large"
                                                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                    >
                                                        <ExpandMore className="text-gray-600" />
                                                    </IconButton>
                                                </Box>

                                                <Collapse in={isOpen} timeout={300}>
                                                    <Divider className="my-4" />
                                                    <Box className="bg-gray-50 rounded-lg p-4">
                                                        <Typography
                                                            variant="subtitle2"
                                                            className="font-semibold text-gray-700 mb-3"
                                                        >
                                                            Order Items
                                                        </Typography>
                                                        <Stack spacing={2}>
                                                            {orderGroup.map((item, idx) => (
                                                                <Box
                                                                    key={idx}
                                                                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border relative"
                                                                >
                                                                    <Box className="flex-1">
                                                                        <Typography
                                                                            variant="body2"
                                                                            className="font-medium text-gray-800"
                                                                        >
                                                                            {item.productName}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="caption"
                                                                            className="text-gray-500"
                                                                        >
                                                                            Quantity: {item.quantity}
                                                                        </Typography>

                                                                        {item.status === 'CANCELLED' && (
                                                                            <Typography
                                                                                variant="caption"
                                                                                className="text-red-600 font-semibold mt-1"
                                                                            >
                                                                                This order was cancelled.
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Chip
                                                                        label={`${item.totalPrice} ₺`}
                                                                        color={item.status === 'CANCELLED' ? 'error' : 'success'}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        className="font-semibold"
                                                                    />
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    </Box>
                                                </Collapse>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                );
                            })}
                        </Stack>
                    )}

                    <Snackbar
                        open={successOpen}
                        autoHideDuration={3000}
                        onClose={() => setSuccessOpen(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert
                            severity="success"
                            variant="filled"
                            onClose={() => setSuccessOpen(false)}
                            className="shadow-lg"
                        >
                            Order placed successfully!
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </>
    );
}