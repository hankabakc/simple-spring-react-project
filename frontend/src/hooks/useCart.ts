import { useCallback } from 'react';
import axios from 'axios';

export function useCart(token: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const addToCart = async (productId: number, quantity: number) => {
        await axios.post(
            `${backendUrl}/api/cart`,
            { productId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };

    const getCart = useCallback(async () => {
        const res = await axios.get(
            `${backendUrl}/api/cart`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    }, [token, backendUrl]); // backendUrl'i dependency olarak ekledik

    const deleteFromCart = async (productId: number) => {
        await axios.delete(
            `${backendUrl}/api/cart/item?productId=${productId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };

    const clearCart = async () => {
        await axios.delete(
            `${backendUrl}/api/cart`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };

    return { addToCart, getCart, deleteFromCart, clearCart };
}
