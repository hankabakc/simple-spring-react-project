'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DetailContent from '@/components/DetailContent';
import { Product } from '@/types/Type';
import Navbar from '@/components/Navbar';
import { fetchProductById } from '@/services/productService';

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
                setError("Product ID not found.");
                setLoading(false);
                return;
            }
            try {
                const result = await fetchProductById(id);
                setProduct(result);
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const noop = () => { };

    return (
        <div className='min-h-screen bg-blue-300'>
            <Navbar
                search={search}
                onSearchChange={handleSearchChange}
                onSearchSubmit={noop}
            />

            {loading ? (
                <div className="text-center mt-10">Loading...</div>
            ) : error ? (
                <div className="text-center mt-10 text-red-500">{error}</div>
            ) : !product ? (
                <div className="text-center mt-10">Product not found.</div>
            ) : (
                <DetailContent product={product} />
            )}
        </div>
    );
}
