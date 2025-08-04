import api from './api';
import { Product } from '@/types/Type';

// Var olanlar:
export const fetchProductById = async (id: string): Promise<Product> => {
    const res = await api.get<Product>(`/api/products/detail`, { params: { id } });
    return res.data;
};

export const createProduct = async (formData: FormData): Promise<void> => {
    await api.post('/api/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateProduct = async (formData: FormData): Promise<void> => {
    await api.put('/api/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const fetchAllProducts = async (): Promise<Product[]> => {
    const res = await api.get<Product[]>('/api/products');
    return res.data;
};

export const searchProducts = async (params: { search?: string; categoryIds?: string }): Promise<Product[]> => {
    const res = await api.get<Product[]>('/api/products/search', { params });
    return res.data;
};

export const deleteProductById = async (id: number): Promise<void> => {
    await api.delete('/api/admin/products', {
        params: {
            id: id
        }
    });
};