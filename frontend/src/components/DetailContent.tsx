'use client';

import React, { useState } from 'react';
import { Product } from '@/types/Type';
import { CardContent, CardActions, Typography, Button, Divider, CardMedia } from '@mui/material';
import { DetailContentProps } from '@/types/Type';
import StyledCard from './common/StyledCard';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import LoginRequiredModal from './LoginRequeiredModal';
import { useCartContext } from '@/context/CartContext';

export default function DetailContent({ product }: DetailContentProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const { addToCartAndRefresh } = useCartContext();

    const handleAddToCart = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await addToCartAndRefresh(product.id, 1);
            alert('Product added to cart!');
        } catch (error: any) {
            console.error('An error occurred while adding the product to the cart:', error.response?.data || error.message || error);
            alert('An error occurred while adding the product to the cart. Check console for details.');
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <StyledCard>
                <CardContent className="p-8 flex flex-col items-center">
                    <CardMedia
                        component="img"
                        image={`data:image/jpeg;base64,${product.base64Image}`}
                        alt={product.name}
                        className="w-full h-64 object-cover mb-default rounded"
                    />
                    <Typography variant="h4" className="text-centered text-primary text-bold mb-default">
                        {product.name}
                    </Typography>
                    <Divider className="divider-primary mb-default" />
                    <Typography variant="body1" className="text-centered text-secondary mb-default">
                        {product.explanation}
                    </Typography>
                    <Typography variant="h5" className="text-centered text-price text-bold mb-default">
                        ${product.price}
                    </Typography>
                </CardContent>
                <CardActions className="flex justify-center pb-4">
                    <Button
                        variant="contained"
                        className="btn-primary"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                </CardActions>
            </StyledCard>
            <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}
