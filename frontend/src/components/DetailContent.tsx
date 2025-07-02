'use client';

import React from 'react';
import { Product } from '@/types/Type';
import { Button } from '@mui/material';

type Props = {
    product: Product;
};

function DetailContent({ product }: Props) {
    return (
        <div className="flex justify-center mt-10">
            <div className="bg-amber-400 p-10 rounded-xl shadow-lg w-[500px]">
                <h2 className="text-3xl font-bold mb-4 text-center">{product.name}</h2>
                <p className="text-xl mb-6 text-center">{product.explanation}</p>
                <p className="text-2xl font-semibold text-center mb-6">${product.price}</p>
                <div className="flex justify-center">
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'rgba(80, 10, 190, 1)' }}
                    >
                        Sepete Ekle
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DetailContent;
