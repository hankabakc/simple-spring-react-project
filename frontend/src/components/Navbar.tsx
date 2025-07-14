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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useState } from 'react';
import { CartItem } from '@/types/Type';
import { useRouter } from 'next/navigation';
import LoginRequiredModal from "@/components/LoginRequeiredModal";

type NavbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
};

export default function Navbar({ search, onSearchChange }: NavbarProps) {
    const { user, logout } = useAuth();
    const { getCart } = useCart(user?.token || '');
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loadingCart, setLoadingCart] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const router = useRouter();

    const handleCartClick = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        setLoadingCart(true);
        try {
            const data = await getCart();
            setCartItems(data);
            setShowCart(!showCart);
        } catch (err) {
            console.error('Cart fetch error', err);
        } finally {
            setLoadingCart(false);
        }
    };

    const handleUserClick = () => {
        if (user) {
            logout();
            router.push('/products');
        } else {
            router.push('/auth/login');
        }
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
                            color="secondary"
                            className="search-input"
                        />
                    </Box>
                    <ButtonGroup variant="text" className="space-x-2">
                        <Button
                            startIcon={<PersonIcon />}
                            onClick={handleUserClick}
                            className="navbar-button"
                        >
                            {user ? 'Logout' : 'Login'}
                        </Button>
                        <Button
                            startIcon={<ShoppingCartIcon />}
                            className="navbar-button"
                            onClick={handleCartClick}
                        >
                            Sepet
                        </Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>

            {showCart && (
                <Box className="absolute top-20 right-5 bg-white rounded shadow-lg w-64 p-4 z-50">
                    <Typography variant="h6">My Cart</Typography>
                    <Divider className="my-2" />

                    {loadingCart ? (
                        <Typography>Loading...</Typography>
                    ) : cartItems.length === 0 ? (
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