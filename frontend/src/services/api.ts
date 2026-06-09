import { ApiError } from '../types';

const API_BASE = 'http://localhost:5000/api';

class ApiClient {
    private accessToken: string | null  = null;

    setAcessToken(token: string | null) {
        this.accessToken = token;
        if (token) {
            localStorage.setIten('accessToken', token);
        }else {
            localStorage.removeIten('accessToken');
        }
    }

    getAccessToken(): string | null {
        if (this.accessToken) {
            return this.accessToken;
        }
        const stored = localStorage.getItem('accessToken ');
        if (stored)  {
            this.accessToken = stored;
        }
            
        return this.accessToken;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}

    ): Promise<T> {
        const url = `${API_BASE}${endpoint}`;
        const headers: Record<string,string> = {
            'Content-Type': 'application/json', ...(options.headers as Record<string,string>),
        };
        const token = this.getAccessToken();
        if (token ) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error desconocido'}));
            throw { status: response.status, ...error} as ApiError;                
        }
        
        if(response.status === 204){
            return {} as T;
        }
        return response.json();
    }
    
    get<T>(endpoint:string):Promise<T> {
        return this.request<T>(endpoint, {method: 'GET'});

    }

    post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    patch<T>(endpoint: string, data?:unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data):undefined,
        });
    }
    delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {method: 'DELETE'});

    }

    uploadFile<T>(endpoint: string, file: File): Promise<T> {
        const url = `${API_BASE}${endpoint}`;
        const formData = new FormData();
        formData.append('file', file);

            return fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`,
            },
            body: formData,
        }).then(async (response) => {
            if(!response.ok){
                const error = await response.json().catch(() => ({message:'Error al subir el archivo'}));
                throw error;
            }
            return response.json();
        });
    }

    dowloadFile(url: string): string {
        return `${API_BASE}${url}`;
    }
}
export const apiCLient = new ApiClient();