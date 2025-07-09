'use client';

import React, { useEffect, useState } from 'react';
import DetailContent from '@/components/DetailContent';
import Navbar from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Product } from '@/types/Type';

export default function ProductDetailPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (id) {
            axios
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/detail?id=${id}`)
                .then((res) => setProduct(res.data))
                .catch((e) => console.log('Error oluştu:', e.response));
        }
    }, [id]);

    if (!id) {
        return <div>EKSIK ID</div>;
    }

    if (!product) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div>
            <Navbar />
            <DetailContent product={product} />
        </div>
    );
}
