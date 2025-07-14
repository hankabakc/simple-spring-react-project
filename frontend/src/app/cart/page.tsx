'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types/Type';
import {
    Box,
    Typography,
    Button,
    Paper,
    List,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import LoginRequiredModal from '@/components/LoginRequeiredModal';
import { useRouter } from 'next/navigation';
import CartItemRow from '@/components/CartItemRow';

// Custom Message Box Component
const MessageBox = ({ open, title, message, onClose }: {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary" autoFocus>
                OK
            </Button>
        </DialogActions>
    </Dialog>
);

export default function CartPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { getCart, addToCart, setCartQuantity, deleteFromCart, clearCart } = useCart(user?.token || '');

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [messageBoxOpen, setMessageBoxOpen] = useState(false);
    const [messageBoxTitle, setMessageBoxTitle] = useState('');
    const [messageBoxContent, setMessageBoxContent] = useState('');

    const showMessage = (title: string, message: string) => {
        setMessageBoxTitle(title);
        setMessageBoxContent(message);
        setMessageBoxOpen(true);
    };

    useEffect(() => {
        if (!user) {
            setShowLoginModal(true);
            setLoading(false);
            return;
        }
        fetchCartItems();
    }, [user]);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCartItems(data);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Could not load cart items.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeQuantity = async (item: CartItem, delta: number) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        const newQuantity = item.quantity + delta;
        try {
            if (newQuantity <= 0) {
                await deleteFromCart(item.productId);
            } else {
                await setCartQuantity(item.productId, newQuantity);

            }
            fetchCartItems();
        } catch (error) {
            console.error("Quantity change error:", error);
            showMessage("Error", "Could not update quantity.");
        }
    };

    const handleRemoveFromCart = async (productId: number) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await deleteFromCart(productId);
            fetchCartItems();
            showMessage("Success", "Item removed from cart.");
        } catch (error) {
            console.error("Remove error:", error);
            showMessage("Error", "Could not remove item.");
        }
    };

    const handleClearCart = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await clearCart();
            fetchCartItems();
            showMessage("Success", "Cart cleared!");
        } catch (error) {
            console.error("Clear error:", error);
            showMessage("Error", "Could not clear cart.");
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(2);
    };

    const handleSetQuantity = async (item: CartItem, newQuantity: number) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await setCartQuantity(item.productId, newQuantity);
            fetchCartItems();
        } catch (error) {
            console.error("Quantity change error:", error);
            showMessage("Error", "Could not update quantity.");
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading cart...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <Box className="min-h-screen bg-gray-50 p-6 font-inter">
            <Paper elevation={3} className="p-8 max-w-2xl mx-auto rounded-xl shadow-lg">
                <Typography variant="h4" className="mb-6 text-center font-bold text-blue-700">
                    Your Cart
                </Typography>
                <Divider className="mb-6 bg-blue-200" />
                {cartItems.length === 0 ? (
                    <Typography variant="h6" className="text-center text-gray-600">
                        Your cart is empty.
                    </Typography>
                ) : (
                    <>
                        <List>
                            {cartItems.map((item) => (
                                <CartItemRow
                                    key={item.productId}
                                    item={item}
                                    onSetQuantity={(newQuantity) => handleSetQuantity(item, newQuantity)}
                                    onDelete={() => handleRemoveFromCart(item.productId)}
                                />
                            ))}
                        </List>
                        <Box className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner">
                            <Typography variant="h5" className="text-right text-blue-800 font-bold">
                                Total: ${calculateTotalPrice()}
                            </Typography>
                            <Box className="flex justify-end mt-6 space-x-4">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleClearCart}
                                    className="px-6 py-3 rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition duration-300 ease-in-out"
                                >
                                    Clear Cart
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
                                    onClick={() => showMessage("Payment", "Redirecting to payment page...")}
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>
            <LoginRequiredModal
                open={showLoginModal}
                onClose={() => {
                    setShowLoginModal(false);
                    router.push('/login');
                }}
            />
            <MessageBox
                open={messageBoxOpen}
                title={messageBoxTitle}
                message={messageBoxContent}
                onClose={() => setMessageBoxOpen(false)}
            />
        </Box>
    );
}
