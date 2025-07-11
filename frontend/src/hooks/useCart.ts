import { useCallback } from 'react';
import axios from 'axios';

export function useCart(token: string) {
    const addToCart = async (productId: number, quantity: number) => {
        await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`,
            { productId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };

    const getCart = useCallback(async () => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    }, [token]);

    return { addToCart, getCart };
}
