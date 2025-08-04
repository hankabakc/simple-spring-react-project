'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types/Type';
import { fetchProductById, updateProduct } from '@/services/productService';
import { fetchAllCategories } from '@/services/categoryService';
import ProductForm from '@/components/admin/ProductForm';
import useApiState from '@/hooks/useApiState';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';

export default function EditProductPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const { loading, error, execute } = useApiState<Product>();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    execute(() => fetchProductById(id)),
                    fetchAllCategories(),
                ]);
                if (productRes.success) {
                    setProduct(productRes.data!);
                }
                setCategories(categoryRes);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            formData.append('id', id!);
            await updateProduct(formData);
            router.push('/admin/products');
        } catch (err: any) {
            console.error(err);
            setSubmitError('Failed to update product.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!id) return <Alert severity="error">Invalid product ID</Alert>;
    if (loading) return <div className="flex justify-center items-center h-40"><CircularProgress /></div>;
    if (!product) return <Alert severity="error">{error || "Failed to fetch product data."}</Alert>;

    const matchedCategory = categories.find(c => c.name === product.categoryName);
    const categoryId = matchedCategory ? matchedCategory.id : 0;

    return (
        <div className="bg-blue-300 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
                <Typography
                    variant="h4"
                    component="h1"
                    className="text-slate-700 font-bold text-center mb-8 tracking-wide"
                >
                    UPDATE PRODUCT
                </Typography>
                <div className='h-5'></div>
                <ProductForm
                    initialValues={{
                        name: product.name,
                        price: product.price,
                        explanation: product.explanation,
                        categoryId: categoryId
                    }}
                    onSubmit={handleSubmit}
                    categories={categories}
                    loading={submitting}
                    error={submitError}
                    submitLabel="SAVE"
                />
            </div>
        </div>
    );
}