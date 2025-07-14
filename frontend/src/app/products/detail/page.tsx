// src/app/products/detail/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DetailContent from '@/components/DetailContent'
import { Product } from '@/types/Type';
import api from '@/services/api';
import Navbar from '@/components/Navbar';

export default function ProductDetailPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError("Ürün ID'si bulunamadı.");
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/api/products/detail?id=${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Ürün detayları çekilirken hata oluştu:", err);
                setError("Ürün detayları yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSearchChange = (searchValue: string) => {
        setSearch(searchValue);
    };

    return (
        <>
            <Navbar search={search} onSearchChange={handleSearchChange} />
            {loading ? (
                <div className="text-centered mt-10">Yükleniyor...</div>
            ) : error ? (
                <div className="text-centered mt-10 text-red-500">{error}</div>
            ) : !product ? (
                <div className="text-centered mt-10">Ürün bulunamadı.</div>
            ) : (
                <DetailContent product={product} />
            )}
        </>
    );
}