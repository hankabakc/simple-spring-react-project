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
import '@/css/all.css'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

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
            >
                <Toolbar className="relative px-5 h-20 bg-blue-600">
                    <Box className="flex items-center">
                        <TextField
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={handleKeyPress}
                            color="secondary"
                            className="bg-white rounded"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Typography
                        variant="h5"
                        className="absolute left-1/2 -translate-x-1/2 text-white font-bold cursor-pointer"
                        onClick={() => router.push('/products')}
                    >
                        LOGO
                    </Typography>
                    <Box className="ml-auto">
                        <ButtonGroup variant="text" className="space-x-2">
                            {user?.role === 'ADMIN' && (
                                <>
                                    <Button
                                        className="navbar-button text-white"
                                        onClick={() => router.push('/admin/orders')}
                                    >
                                        Admin Orders
                                    </Button>
                                    <Button
                                        className="navbar-button text-white"
                                        onClick={() => router.push('/admin/products')}
                                    >
                                        Admin Products
                                    </Button>
                                </>
                            )}

                            {user && (
                                <Button
                                    startIcon={<ReceiptLongIcon />}
                                    className="navbar-button text-white"
                                    onClick={goToOrders}
                                >
                                    Orders
                                </Button>
                            )}
                            <Button
                                startIcon={<ShoppingCartIcon />}
                                className="navbar-button text-white"
                                onClick={handleCartClick}
                            >
                                Cart
                            </Button>
                            <Button
                                startIcon={<PersonIcon />}
                                onClick={handleUserClick}
                                className="navbar-button text-white"
                            >
                                {user ? 'Logout' : 'Login'}
                            </Button>
                        </ButtonGroup>
                    </Box>
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
