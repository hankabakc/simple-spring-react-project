'use client';

import React from 'react';
import { Product } from '@/types/Type';
import { Card, CardContent, CardActions, Typography, Button, Divider, CardMedia } from '@mui/material';

type Props = {
    product: Product;
};

export default function DetailContent({ product }: Props) {
    return (
        <div className="flex justify-center mt-10">
            <Card className="card-primary w-[500px]">
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
                    >
                        Sepete Ekle
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}