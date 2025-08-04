'use client';

import React, { useState } from 'react';
import { Product } from '@/types/Type';
import { Typography, Button } from '@mui/material';
import { DetailContentProps } from '@/types/Type';
import StyledCard from '../StyledCard';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import LoginRequiredModal from './LoginRequeiredModal';

export default function DetailContent({ product }: DetailContentProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(product.base64Images[0]);
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
            console.error('Error:', error.response?.data || error.message || error);
            alert('An error occurred while adding the product to the cart.');
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto mt-10 px-4 bg-white rounded shadow">
            {/* Üstte: Büyük Resim */}
            <div className="w-full  p-2 mb-4">
                <img
                    src={`data:image/jpeg;base64,${selectedImage}`}
                    alt="Selected"
                    className="w-full h-80 object-contain rounded"
                />
            </div>

            {/* Ortada: Açıklama + fiyat + buton */}
            <div className="w-full border p-4 mb-6 text-center bg-white rounded shadow">
                <Typography variant="h4" className="font-bold mb-2">
                    {product.name}
                </Typography>
                <Typography variant="body1" className="mb-2 text-gray-700">
                    {product.explanation}
                </Typography>
                <Typography variant="h5" className="mb-4 text-green-700 font-semibold">
                    ${product.price}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    style={{ backgroundColor: '#1976d2', color: 'white' }}
                >
                    Add to Cart
                </Button>
            </div>

            {/* En altta: Küçük resimler ayrı div'de */}
            <div className="w-full border p-3 mb-10">
                <div className="flex flex-wrap justify-center gap-2">
                    {product.base64Images.map((img, index) => (
                        <img
                            key={index}
                            src={`data:image/jpeg;base64,${img}`}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => setSelectedImage(img)}
                            className={`w-20 h-20 object-cover rounded cursor-pointer border ${selectedImage === img ? 'border-black' : 'border-gray-300'}`}
                        />
                    ))}
                </div>
            </div>

            <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}
