// src/app/products/page.tsx (veya ilgili ProductsPage bileşen dosyanız)
'use client';

import React, { useEffect, useState } from 'react';
import Content from '@/components/Content';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Category, Product } from '@/types/Type'; // Category tipinizin `id: number` ve `name: string` içerdiğini varsayıyorum
import api from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const searchQuery = searchParams.get('search') || '';
    // URL'den gelen kategori ID'lerini alıp sayıya dönüştürüyoruz
    const selectedCategoryIds = searchParams.getAll('categoryIds').map(Number).filter(id => !isNaN(id));

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                setLoading(true);

                const query = new URLSearchParams();
                if (searchQuery) query.set('search', searchQuery);

                // Seçili kategori ID'lerini URLSearchParams'e ekliyoruz
                // Backend'e '/api/products/search?categoryIds=1&categoryIds=2' şeklinde gidecek
                selectedCategoryIds.forEach((id) => query.append('categoryIds', id.toString()));

                const [productsRes, categoriesRes] = await Promise.all([
                    // Yeni arama endpoint'imizi çağırıyoruz
                    api.get(`/api/products/search?${query.toString()}`),
                    // Kategori listesi için mevcut endpoint'i kullanıyoruz
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

        // Bağımlılıkları güncelledik: arama sorgusu, seçili kategori ID'leri ve kategorilerin kendisi
        fetchProductsAndCategories();
    }, [searchQuery, selectedCategoryIds.join(','), categories.length]);

    const handleSearchChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        router.push(`/products?${params.toString()}`);
    };

    // Kategori değişimini ele alan fonksiyon, artık kategori ID'si alıyor
    const handleCategoryChange = (categoryId: number, checked: boolean) => {
        const params = new URLSearchParams(searchParams);
        let currentCategoryIds = searchParams.getAll('categoryIds').map(Number).filter(id => !isNaN(id));

        if (checked) {
            // Eğer ID zaten listede yoksa ekle
            if (!currentCategoryIds.includes(categoryId)) {
                currentCategoryIds.push(categoryId);
            }
        } else {
            // ID'yi listeden çıkar
            currentCategoryIds = currentCategoryIds.filter((id) => id !== categoryId);
        }

        // URL'deki tüm 'categoryIds' parametrelerini temizle ve güncel listeyi yeniden ekle
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
            <Navbar search={searchQuery} onSearchChange={handleSearchChange} />
            <div className="flex flex-1">
                <Sidebar
                    // Sidebar'a seçili kategori ID'lerini iletiyoruz
                    selected={selectedCategoryIds}
                    // onChange prop'u artık kategori ID'si ve boolean alıyor
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