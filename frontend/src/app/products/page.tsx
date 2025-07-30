'use client';

import React, { useEffect, useState, useRef } from 'react';
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
    const fetchedCategoriesRef = useRef(false);

    useEffect(() => {
        if (fetchedCategoriesRef.current) {
            return;
        }
        const fetchCategories = async () => {
            try {
                const categoriesRes = await api.get('/api/categories');
                setCategories(categoriesRes.data);
                fetchedCategoriesRef.current = true;
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (urlSearchQuery) query.set('search', urlSearchQuery);

                selectedCategoryIds.forEach((id) => query.append('categoryIds', id.toString()));

                const productsRes = await api.get(`/api/products/search?${query.toString()}`);
                setProducts(productsRes.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [urlSearchQuery, selectedCategoryIds.join(',')]);

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
        return <div className="text-centered mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-centered mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-blue-300">
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
