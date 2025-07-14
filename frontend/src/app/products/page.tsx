// src/app/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Content from '@/components/Content';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Category, Product } from '@/types/Type';
import api from '@/services/api';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/api/products'),
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
    }, []);

    const handleCategoryChange = (categoryName: string, checked: boolean) => {
        setSelectedCategories((prev) =>
            checked ? [...prev, categoryName] : prev.filter((c) => c !== categoryName)
        );
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.includes(product.categoryName);
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return <div className="text-centered mt-10">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-centered mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar search={searchQuery} onSearchChange={setSearchQuery} />
            <div className="flex flex-1">
                <Sidebar
                    selected={selectedCategories}
                    onChange={handleCategoryChange}
                    categories={categories}
                />
                <main className="flex-1 p-5">
                    <Content products={filteredProducts} />
                </main>
            </div>
        </div>
    );
}