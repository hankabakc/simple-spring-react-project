'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { OrderResponse } from '@/types/Type';
import {
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Divider,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '@/components/Navbar';
import { groupOrders } from '@/utils/orderUtils';
import AdminDeleteModal from '@/components/AdminDeleteModal';

export default function AdminOrdersPage() {
    const [ordersGrouped, setOrdersGrouped] = useState<Record<number, OrderResponse[]>>({});
    const [filters, setFilters] = useState({
        username: '',
        productName: '',
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrderGroup, setSelectedOrderGroup] = useState<OrderResponse[] | null>(null);

    const fetchOrders = async () => {
        const response = await api.get('/api/admin/orders');
        const grouped = groupOrders(response.data);
        setOrdersGrouped(grouped);
    };

    const searchOrders = async () => {
        const response = await api.get('/api/admin/orders/search', {
            params: {
                username: filters.username || undefined,
                productName: filters.productName || undefined,
            },
        });
        const grouped = groupOrders(response.data);
        setOrdersGrouped(grouped);
    };

    const handleDeleteClick = (group: OrderResponse[]) => {
        setSelectedOrderGroup(group);
        setModalOpen(true);
    };

    const handleConfirmDelete = async (adminMessage: string) => {
        if (!selectedOrderGroup) return;

        try {
            await Promise.all(
                selectedOrderGroup.map((order) =>
                    api.post('/api/admin/orders/delete', {
                        orderId: order.id,
                        adminMessage: adminMessage,
                    })
                )
            );
            fetchOrders();
            setModalOpen(false);
            setSelectedOrderGroup(null);
        } catch (error) {
            console.error('Silme hatası:', error);
            alert('Silme işlemi başarısız oldu.');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const search = '';
    const noop = () => { };

    return (
        <>
            <Navbar search={search} onSearchChange={noop} onSearchSubmit={noop} />
            <Box className="p-6 space-y-6">
                <Typography variant="h5" className="font-bold">
                    Order Management
                </Typography>
                <div className='h-5'></div>

                <Box className="flex flex-wrap gap-4 mb-4">
                    <TextField
                        label="Username"
                        value={filters.username}
                        onChange={(e) => setFilters((f) => ({ ...f, username: e.target.value }))}
                        className="w-full sm:w-[200px]"
                    />
                    <TextField
                        label="Product Name"
                        value={filters.productName}
                        onChange={(e) => setFilters((f) => ({ ...f, productName: e.target.value }))}
                        className="w-full sm:w-[200px]"
                    />
                    <Button variant="contained" onClick={searchOrders} className="h-[56px]">
                        Search
                    </Button>
                </Box>

                {Object.keys(ordersGrouped).length === 0 ? (
                    <Typography variant="body1" className="mt-6 text-gray-500">
                        No orders found yet.
                    </Typography>
                ) : (
                    Object.entries(ordersGrouped).map(([orderId, orderGroup]) => {
                        const isDeleted = orderGroup[0].status === 'DELETED';
                        return (
                            <Paper key={orderId} className="p-4 mb-6 shadow-md">
                                <Box className="flex justify-between items-center mb-2">
                                    <Typography variant="subtitle1" className="font-semibold">
                                        Order ID: {orderId} — User: {orderGroup[0].username}
                                    </Typography>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteClick(orderGroup)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                {isDeleted && (
                                    <Alert severity="error" className="mb-3">
                                        Bu sipariş iptal edilmiştir.
                                        {orderGroup[0].adminMessage && (
                                            <> Sebep: <strong>{orderGroup[0].adminMessage}</strong></>
                                        )}
                                    </Alert>
                                )}

                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Unit Price</TableCell>
                                            <TableCell>Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderGroup.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{item.productName}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.price} ₺</TableCell>
                                                <TableCell>{item.totalPrice} ₺</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Divider className="my-2" />
                                <Typography variant="body2" className="text-right font-bold">
                                    Total Order Amount:{' '}
                                    {orderGroup.reduce((sum, i) => sum + i.totalPrice, 0).toFixed(2)} ₺
                                </Typography>
                            </Paper>
                        );
                    })
                )}
            </Box>

            <AdminDeleteModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
