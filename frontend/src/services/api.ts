import axios from 'axios';
import { User } from '@/types/Type';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

        if (userString) {
            try {
                const user: User = JSON.parse(userString);

                // Log: user objesi nasıl görünüyor?
                console.log("🔐 Parsed User from localStorage:", user);

                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;

                    // Log: Header’a token eklenmiş mi?
                    console.log("✅ TOKEN HEADER EKLENDİ:", config.headers.Authorization);
                } else {
                    console.warn("⚠️ Token bulunamadı! user.token yok.");
                }

            } catch (error) {
                console.error("❌ localStorage'dan user parse edilemedi:", error);

                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                }
            }
        } else {
            console.warn("⚠️ localStorage.getItem('user') null döndü!");
        }

        return config;
    },
    (error) => {
        console.error("❌ Axios interceptor hatası:", error);
        return Promise.reject(error);
    }
);

export default api;
