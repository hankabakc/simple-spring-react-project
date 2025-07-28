import api from './api';
import { User } from '@/types/Type';


export const loginUser = async (data: {
    email: string;
    password: string;
}): Promise<User> => {
    const res = await api.post<User>('/api/auth/login', data);
    return res.data;
};


export const registerUser = async (data: {
    email: string;
    password: string;
    name: string;
    surname: string;
}): Promise<void> => {
    await api.post('/api/auth/register', data);
};
