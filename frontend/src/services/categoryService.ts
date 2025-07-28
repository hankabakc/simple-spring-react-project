import api from './api';
import { Category } from '@/types/Type';

export const fetchAllCategories = async (): Promise<Category[]> => {
    const res = await api.get<Category[]>('/api/categories');
    return res.data;
};