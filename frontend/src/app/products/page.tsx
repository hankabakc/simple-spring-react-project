'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Content from '@/components/Content';
import { Product } from '@/types/Type';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`)
            .then((res) => setProducts(res.data))
            .catch((err) => console.error('Error:', err));
    }, []);

    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories((prev) =>
            checked ? [...prev, category] : prev.filter((c) => c !== category)
        );
    };

    useEffect(() => {
        console.log('Products:', products);
    }, [products]);

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.categoryName);

        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        console.log(selectedCategories)

    }, [selectedCategories])


    if (!products.length) {
        return <div>Loading...</div>;
    }



    return (
        <div className="flex">
            <Sidebar selected={selectedCategories} onChange={handleCategoryChange} />
            <div className="flex-1 min-h-screen bg-gray-100">
                <Navbar search={search} onSearchChange={setSearch} />
                <Content products={filteredProducts} />
            </div>
        </div>
    );
}
