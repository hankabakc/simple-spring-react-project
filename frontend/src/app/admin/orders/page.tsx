'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api'; // senin verdiğin api.ts dosyasındaki Axios örneği
import { OrderResponse } from '@/types/Type';
import {
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, TextField, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [filters, setFilters] = useState({
        username: '',
        productName: '',
        minPrice: '',
        maxPrice: '',
    });

    const fetchOrders = async () => {
        const response = await api.get('/admin/orders');
        setOrders(response.data);
    };

    const searchOrders = async () => {
        const response = await api.get('/admin/orders/search', {
            params: {
                username: filters.username || undefined,
                productName: filters.productName || undefined,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined,
            },
        });
        setOrders(response.data);
    };

    const deleteOrder = async (id: number) => {
        await api.delete(`/admin/orders/${id}`);
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Tüm Siparişler</h2>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <TextField label="Kullanıcı Adı" value={filters.username} onChange={e => setFilters(f => ({ ...f, username: e.target.value }))} />
                <TextField label="Ürün Adı" value={filters.productName} onChange={e => setFilters(f => ({ ...f, productName: e.target.value }))} />
                <TextField label="Min Fiyat" type="number" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
                <TextField label="Max Fiyat" type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
            </div>

            <Button variant="contained" onClick={searchOrders} className="mb-4">Ara</Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Kullanıcı</TableCell>
                        <TableCell>Ürün</TableCell>
                        <TableCell>Adet</TableCell>
                        <TableCell>Fiyat</TableCell>
                        <TableCell>Toplam</TableCell>
                        <TableCell>Aksiyon</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.username}</TableCell>
                            <TableCell>{order.productName}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => deleteOrder(order.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
