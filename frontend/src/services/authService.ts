import { apiClient} from './api';
import type { AuthResponse, User} from '../types';

export const authService = {
    async register(name:string,email:string, password:string): Promise<User> {
        const response = await apiClient.post<{user:User}>('/auth/register', {
            name,
            email,
            password,
        });
        return response.user;
        },
    
    async login(email:string, password:string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', {
            email,
            password,
        });
        apiClient.setAccessToken(response.accessToken);
        return response;
    },

    async refresh(): Promise<{ accessToken: string; user: User}> {
        const response = await apiClient.post<{accessToken: string; user:User}>('/auth/refresh');
        apiClient.setAccessToken(response.accessToken);
        return response;
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
        apiClient.setAccessToken(null);
    },

    async getSession(): Promise<{ accessToken: string;user:User} | null> {
        try {
            const response = await apiClient.post<{accessToken:String;user:User}>('/auth/session');
            return response;
        } catch {
            return null;
        }
    },

};