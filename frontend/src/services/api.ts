// services/api.ts
import axios from 'axios';
import { User } from '@/types/Type'; // User tipini import etmeyi unutma

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        // Token'ı localStorage'dan doğru şekilde al
        const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (userString) {
            try {
                const user: User = JSON.parse(userString);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage in interceptor:", error);
                // Hatalı veriyi temizle ki sürekli hata vermesin
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;