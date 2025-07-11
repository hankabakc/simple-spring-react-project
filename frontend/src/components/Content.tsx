'use client';

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/Type";
import { Card, CardContent, CardActions, Typography, Button, Divider, CardMedia } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import LoginRequiredModal from "./LoginRequeiredModal";


export default function Content({ products }: { products: Product[] }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const { addToCart } = useCart(user?.token || '');

    const handleAddToCart = async (productId: number) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        try {
            await addToCart(productId, 1);
            alert("Product added to cart!");
        } catch {
            alert("Failed to add product to cart.");
        }
    };


    return (
        <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        className="bg-purple-950 border border-blue-500 rounded-xl shadow-none flex flex-col items-center"
                    >
                        <Link href={`/products/detail?id=${product.id}`} className="w-full">
                            <CardContent className="p-6 w-full flex flex-col items-center">
                                <CardMedia
                                    component="img"
                                    image={`data:image/jpeg;base64,${product.base64Image}`}
                                    alt={product.name}
                                    className="w-full h-48 object-cover mb-4 rounded"
                                />

                                <Typography variant="h6" className="text-gray-200 font-bold mb-2 text-center">
                                    {product.name}
                                </Typography>

                                <Divider className="border-blue-500 w-full mb-2" />

                                <Typography variant="body2" className="text-gray-300 text-center mb-2">
                                    {product.explanation}
                                </Typography>
                                <Typography variant="subtitle1" className="text-gray-100 font-semibold text-center">
                                    ${product.price}
                                </Typography>
                            </CardContent>
                        </Link>
                        <CardActions className="w-full flex justify-center pb-4">
                            <Button
                                variant="contained"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleAddToCart(product.id)}
                            >
                                Sepete Ekle
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
            <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}
