'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming this path is correct
import { useCart } from '@/hooks/useCart'; // Assuming this path is correct
import { CartItem } from '@/types/Type'; // Assuming this path is correct
import {
    Box,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LoginRequiredModal from '@/components/LoginRequeiredModal'; // Assuming this path is correct
import { useRouter } from 'next/navigation';

// Custom Message Box Component to replace alert()
interface MessageBoxProps {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ open, title, message, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="message-box-title">
            <DialogTitle id="message-box-title">{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    Tamam
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default function CartPage() {
    const { user } = useAuth();
    const router = useRouter();
    // Initialize useCart with a default empty string if user?.token is undefined
    const { getCart, deleteFromCart, clearCart } = useCart(user?.token || '');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // State for custom message box
    const [messageBoxOpen, setMessageBoxOpen] = useState(false);
    const [messageBoxTitle, setMessageBoxTitle] = useState('');
    const [messageBoxContent, setMessageBoxContent] = useState('');

    // Function to show custom message box
    const showMessage = (title: string, message: string) => {
        setMessageBoxTitle(title);
        setMessageBoxContent(message);
        setMessageBoxOpen(true);
    };

    // Effect to fetch cart items when user changes or component mounts
    useEffect(() => {
        if (!user) {
            setShowLoginModal(true);
            setLoading(false);
            return;
        }
        fetchCartItems();
    }, [user]); // Dependency on user to refetch when auth state changes

    // Function to fetch cart items from the API
    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCartItems(data);
        } catch (err) {
            console.error("Sepet öğeleri çekilirken hata oluştu:", err);
            setError("Sepet öğeleri yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    // Handler for removing an item from the cart
    const handleRemoveFromCart = async (productId: number) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await deleteFromCart(productId);
            fetchCartItems(); // Re-fetch cart items to update the UI
            showMessage("Başarılı", "Ürün sepetten kaldırıldı!");
        } catch (error: any) {
            console.error("Ürün sepetten kaldırılırken hata oluştu:", error.response?.data || error.message || error);
            showMessage("Hata", "Ürün sepetten kaldırılırken hata oluştu.");
        }
    };

    // Handler for clearing the entire cart
    const handleClearCart = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await clearCart();
            fetchCartItems(); // Re-fetch cart items to update the UI
            showMessage("Başarılı", "Sepet temizlendi!");
        } catch (error: any) {
            console.error("Sepet temizlenirken hata oluştu:", error.response?.data || error.message || error);
            showMessage("Hata", "Sepet temizlenirken hata oluştu.");
        }
    };

    // Calculates the total price of items in the cart
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(2);
    };

    // Display loading state
    if (loading) {
        return <div className="text-center mt-10">Sepet yükleniyor...</div>;
    }

    // Display error state
    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <Box className="min-h-screen bg-gray-50 p-6 font-inter"> {/* Added font-inter class */}
            <Paper elevation={3} className="p-8 max-w-2xl mx-auto rounded-xl shadow-lg"> {/* Increased padding and added shadow */}
                <Typography variant="h4" className="mb-6 text-center font-bold text-blue-700"> {/* Adjusted margin, font weight, and color */}
                    Sepetiniz
                </Typography>
                <Divider className="mb-6 bg-blue-200" /> {/* Adjusted margin and color */}
                {cartItems.length === 0 ? (
                    <Typography variant="h6" className="text-center text-gray-600">
                        Sepetiniz boş.
                    </Typography>
                ) : (
                    <>
                        <List>
                            {cartItems.map((item) => (
                                <React.Fragment key={item.productId}>
                                    <ListItem className="py-4 flex items-center justify-between"> {/* Use flexbox for alignment */}
                                        <div className="flex items-center">
                                            <img
                                                src={`data:image/jpeg;base64,${item.productImage}`}
                                                alt={item.productName}
                                                className="w-24 h-24 object-cover rounded-lg mr-4 shadow-md" // Increased size, rounded corners, and shadow
                                            />
                                            <ListItemText
                                                primary={<Typography variant="h6" className="text-gray-800 font-semibold">{item.productName}</Typography>}
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" className="text-gray-600">Adet: {item.quantity}</Typography>
                                                        <Typography variant="subtitle1" className="text-green-700 font-bold mt-1">${item.productPrice.toFixed(2)}</Typography> {/* Changed color and font weight */}
                                                    </>
                                                }
                                            />
                                        </div>
                                        {/* IconButton directly inside ListItem */}
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(item.productId)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </ListItem>
                                    <Divider component="li" className="bg-gray-200" /> {/* Added color to divider */}
                                </React.Fragment>
                            ))}
                        </List>
                        <Box className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner"> {/* Increased padding, changed background, added shadow */}
                            <Typography variant="h5" className="text-right text-blue-800 font-bold"> {/* Adjusted color and font weight */}
                                Toplam: ${calculateTotalPrice()}
                            </Typography>
                            <Box className="flex justify-end mt-6 space-x-4"> {/* Adjusted margin */}
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleClearCart}
                                    className="px-6 py-3 rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition duration-300 ease-in-out" // Custom Tailwind styles
                                >
                                    Sepeti Temizle
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out shadow-md" // Custom Tailwind styles
                                    onClick={() => showMessage("Ödeme", "Ödeme sayfasına yönlendiriliyor...")}
                                >
                                    Ödeme Yap
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
            {/* Custom Message Box Component */}
            <MessageBox
                open={messageBoxOpen}
                title={messageBoxTitle}
                message={messageBoxContent}
                onClose={() => setMessageBoxOpen(false)}
            />
        </Box>
    );
}
