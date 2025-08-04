'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/Type';
import { fetchAllCategories } from '@/services/categoryService';
import { createProduct } from '@/services/productService';
import ProductForm from '@/components/admin/ProductForm';
import useApiState from '@/hooks/useApiState';
import { Box, Paper, Typography } from '@mui/material';

export default function AddProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const { loading, error, execute } = useApiState<void>();

    fetchAllCategories()
        .then(setCategories)
        .catch(() => setCategories([]));

    const handleSubmit = async (formData: FormData) => {
        const result = await execute(() => createProduct(formData));
        if (result.success) {
            router.push('/admin/products');
        }
    };

    return (
        <Box className="min-h-screen bg-blue-300 flex items-center justify-center p-4">
            <Paper elevation={3} className="p-6 w-full max-w-xl">
                <Typography variant="h6" className="mb-4 font-bold text-center">
                    ADD NEW PRODUCT
                </Typography>
                <div className="h-5"></div>
                <ProductForm
                    onSubmit={handleSubmit}
                    categories={categories}
                    loading={loading}
                    error={error}
                    submitLabel="Add"
                />
            </Paper>
        </Box>
    );
}
