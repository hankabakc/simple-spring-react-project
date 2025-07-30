import api from './api';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '@/types/Type';


export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data;
};
export const registerUser = async (form: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/api/auth/register', form);
    return response.data;
};