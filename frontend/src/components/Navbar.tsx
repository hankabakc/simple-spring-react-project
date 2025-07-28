'use client';

import {
    AppBar,
    Toolbar,
    TextField,
    Button,
    ButtonGroup,
    Box,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginRequiredModal from "@/components/LoginRequeiredModal";
import { NavbarProps } from '@/types/Type';
import { useCartContext } from '@/context/CartContext';

export default function Navbar({ search, onSearchChange, onSearchSubmit }: NavbarProps) {
    const { user, logout } = useAuth();
    const [showCart, setShowCart] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { cartItems, refreshCart } = useCartContext();
    const router = useRouter();

    const handleCartClick = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        await refreshCart();
        setShowCart(!showCart);
    };

    const handleUserClick = () => {
        if (user) {
            logout();
            router.push('/products');
        } else {
            router.push('/auth/login');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearchSubmit(search);
        }
    };

    const goToOrders = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        router.push('/orders');
    };

    return (
        <>
            <AppBar
                position="static"
                className="bg-purple-950 border-b divider-primary shadow-none"
            >
                <Toolbar className="flex justify-between items-center px-5 h-20">
                    <Box className="flex items-center">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={handleKeyPress}
                            color="secondary"
                            className="search-input"
                        />
                    </Box>
                    <ButtonGroup variant="text" className="space-x-2">
                        {user?.role === 'ADMIN' && (
                            <>
                                <Button
                                    className="navbar-button"
                                    onClick={() => router.push('/admin/orders')}
                                >
                                    Admin Orders
                                </Button>
                                <Button
                                    className="navbar-button"
                                    onClick={() => router.push('/admin/products')}
                                >
                                    Admin Products
                                </Button>
                            </>
                        )}

                        {user && (
                            <Button
                                startIcon={<ReceiptLongIcon />}
                                className="navbar-button"
                                onClick={goToOrders}
                            >
                                Orders
                            </Button>
                        )}
                        <Button
                            startIcon={<ShoppingCartIcon />}
                            className="navbar-button"
                            onClick={handleCartClick}
                        >
                            Cart
                        </Button>
                        <Button
                            startIcon={<PersonIcon />}
                            onClick={handleUserClick}
                            className="navbar-button"
                        >
                            {user ? 'Logout' : 'Login'}
                        </Button>
                    </ButtonGroup>

                </Toolbar>
            </AppBar>

            {showCart && (
                <Box className="absolute top-20 right-5 bg-white rounded shadow-lg w-64 p-4 z-50">
                    <Typography variant="h6">My Cart</Typography>
                    <Divider className="my-2" />

                    {cartItems.length === 0 ? (
                        <Typography>No items in cart</Typography>
                    ) : (
                        cartItems.map((item) => (
                            <Box key={item.productId} className="flex justify-between my-2">
                                <Typography>{item.productName}</Typography>
                                <Typography>x{item.quantity}</Typography>
                            </Box>
                        ))
                    )}

                    <Divider className="my-2" />
                    <Link href="/cart">
                        <Button variant="contained" fullWidth color="primary" className="btn-primary">
                            Go to Cart
                        </Button>
                    </Link>
                </Box>
            )}

            <LoginRequiredModal
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
}
