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


                console.log(" Parsed User from localStorage:", user);

                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;


                    console.log("TOKEN HEADER ADDED:", config.headers.Authorization);
                } else {
                    console.warn(" Token not found! user.token is missing.");
                }

            } catch (error) {
                console.error(" Failed to parse user from localStorage:", error);

                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                }
            }
        } else {
            console.warn(" localStorage.getItem('user') returned null!");
        }

        return config;
    },
    (error) => {
        console.error(" Axios interceptor error:", error);
        return Promise.reject(error);
    }
);

export default api;
