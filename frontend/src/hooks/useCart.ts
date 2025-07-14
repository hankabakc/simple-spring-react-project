import { useCallback } from 'react';
import api from '@/services/api';

export function useCart(token: string) {

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const addToCart = async (productId: number, quantity: number) => {
        await api.post('/api/cart', { productId, quantity }, config);
    };

    const setCartQuantity = async (productId: number, quantity: number) => {
        await api.put('/api/cart', { productId, quantity }, config);
    };

    const getCart = useCallback(async () => {
        const res = await api.get('/api/cart', config);
        return res.data;
    }, [token]);

    const deleteFromCart = async (productId: number) => {
        await api.delete(`/api/cart/item?productId=${productId}`, config);
    };

    const clearCart = async () => {
        await api.delete('/api/cart', config);
    };

    return { addToCart, setCartQuantity, getCart, deleteFromCart, clearCart };
}
