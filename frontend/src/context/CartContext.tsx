'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem } from '@/types/Type';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { CartContextType } from '@/types/Type';



const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { getCart, addToCart } = useCart(user?.token || '');

    const refreshCart = async () => {
        if (!user) return;
        try {
            const data = await getCart();
            setCartItems(data);
        } catch (err) {
            console.error('Cart refresh error:', err);
        }
    };

    const addToCartAndRefresh = async (productId: number, quantity: number) => {
        if (!user) return;
        try {
            await addToCart(productId, quantity);
            await refreshCart();
        } catch (err) {
            console.error('Add to cart error:', err);
        }
    };

    useEffect(() => {
        if (user) {
            refreshCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    return (
        <CartContext.Provider value={{ cartItems, refreshCart, addToCartAndRefresh }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCartContext must be used within a CartProvider');
    return context;
}
