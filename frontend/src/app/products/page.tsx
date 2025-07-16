// src/app/products/page.tsx (ProductsPage bileşeni)

'use client';

import React, { useEffect, useState } from 'react';
import Content from '@/components/Content';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Category, Product } from '@/types/Type';
import api from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const urlSearchQuery = searchParams.get('search') || '';
    const [currentSearchInput, setCurrentSearchInput] = useState(urlSearchQuery);

    const selectedCategoryIds = searchParams.getAll('categoryIds').map(Number).filter(id => !isNaN(id));

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                setLoading(true);

                const query = new URLSearchParams();
                if (urlSearchQuery) query.set('search', urlSearchQuery);

                selectedCategoryIds.forEach((id) => query.append('categoryIds', id.toString()));

                const [productsRes, categoriesRes] = await Promise.all([
                    api.get(`/api/products/search?${query.toString()}`),
                    api.get('/api/categories')
                ]);

                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Veri çekilirken hata oluştu:", err);
                setError("Veriler yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategories();
    }, [urlSearchQuery, selectedCategoryIds.join(','), categories.length]);


    const handleSearchInputChange = (value: string) => {
        setCurrentSearchInput(value);
    };


    const handleSearchSubmit = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        router.push(`/products?${params.toString()}`);
    };

    const handleCategoryChange = (categoryId: number, checked: boolean) => {
        const params = new URLSearchParams(searchParams);
        let currentCategoryIds = searchParams.getAll('categoryIds').map(Number).filter(id => !isNaN(id));

        if (checked) {
            if (!currentCategoryIds.includes(categoryId)) {
                currentCategoryIds.push(categoryId);
            }
        } else {
            currentCategoryIds = currentCategoryIds.filter((id) => id !== categoryId);
        }

        params.delete('categoryIds');
        currentCategoryIds.forEach((id) => params.append('categoryIds', id.toString()));

        router.push(`/products?${params.toString()}`);
    };

    if (loading) {
        return <div className="text-centered mt-10">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-centered mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar
                search={currentSearchInput}
                onSearchChange={handleSearchInputChange}
                onSearchSubmit={handleSearchSubmit}
            />
            <div className="flex flex-1">
                <Sidebar
                    selected={selectedCategoryIds}
                    onChange={handleCategoryChange}
                    categories={categories}
                />
                <main className="flex-1 p-5">
                    <Content products={products} />
                </main>
            </div>
        </div>
    );
}