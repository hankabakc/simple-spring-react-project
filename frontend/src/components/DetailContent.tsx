'use client';

import React from 'react';
import { Product } from '@/types/Type';
import { Card, CardContent, CardActions, Typography, Button, Divider } from '@mui/material';

type Props = {
    product: Product;
};

export default function DetailContent({ product }: Props) {
    return (
        <div className="flex justify-center mt-10">
            <Card className="bg-purple-950 border border-blue-500 rounded-xl w-[500px] shadow-none">
                <CardContent className="p-8">
                    <Typography variant="h4" className="text-center text-gray-200 font-bold mb-4">
                        {product.name}
                    </Typography>
                    <Divider className="border-blue-500 mb-4" />
                    <Typography variant="body1" className="text-center text-gray-300 mb-4">
                        {product.explanation}
                    </Typography>
                    <Typography variant="h5" className="text-center text-gray-100 font-semibold mb-4">
                        ${product.price}
                    </Typography>
                </CardContent>
                <CardActions className="flex justify-center pb-4">
                    <Button
                        variant="contained"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Sepete Ekle
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
