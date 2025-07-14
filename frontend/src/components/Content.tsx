// src/components/Content.tsx

'use client';
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/Type";
import { CardContent, CardActions, Typography, Button, Divider, CardMedia } from "@mui/material";
import Link from "next/link";
import LoginRequiredModal from "./LoginRequeiredModal";
import StyledCard from './common/StyledCard';
import { useCartContext } from "@/context/CartContext";

export default function Content({ products }: { products: Product[] }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const { addToCart } = useCart(user?.token || '');
    const { addToCartAndRefresh } = useCartContext();

    const handleAddToCart = async (productId: number) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await addToCartAndRefresh(productId, 1);
            alert("Ürün sepete eklendi!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <StyledCard
                        key={product.id}
                    >
                        <Link href={`/products/detail?id=${product.id}`} className="w-full">
                            <CardContent className="p-default w-full flex flex-col items-center">
                                <CardMedia
                                    component="img"
                                    image={`data:image/jpeg;base64,${product.base64Image}`}
                                    alt={product.name}
                                    className="w-full h-48 object-cover mb-default rounded"
                                />
                                <Typography variant="h6" className="text-primary text-bold mb-default text-centered">
                                    {product.name}
                                </Typography>
                                <Divider className="divider-primary w-full mb-default" />
                                <Typography variant="body2" className="text-secondary text-centered mb-default">
                                    {product.explanation}
                                </Typography>
                                <Typography variant="subtitle1" className="text-price font-semibold text-centered">
                                    ${product.price}
                                </Typography>
                            </CardContent>
                        </Link>
                        <CardActions className="w-full flex justify-center pb-4">
                            <Button
                                variant="contained"
                                className="btn-primary"
                                onClick={() => handleAddToCart(product.id)}
                            >
                                Sepete Ekle
                            </Button>
                        </CardActions>
                    </StyledCard>
                ))}
            </div>
            <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}