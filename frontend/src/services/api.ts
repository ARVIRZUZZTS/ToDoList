import type { ApiError } from '../types';

const API_BASE = 'https://localhost:5000/api';

class ApiClient {
    private accessToken: string | null  = null;
    private refreshPromise: Promise<boolean> | null = null;

    setAccessToken(token: string | null) {
        this.accessToken = token;        
    }

    getAccessToken(): string | null {
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
        if (token && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/session')) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const makeRequest = async (): Promise<Response> => {
            return fetch(url, {
                ...options,
                headers,
                credentials: 'include',
            });
        };
        let response = await makeRequest();

        if (response.status === 401 && !endpoint.includes('/auth/')) {
            const refreshed = await this.refreshSession();
            if (refreshed) {
                const newToken = this.getAccessToken();
                if (newToken) {
                    headers['Authorization'] = `Bearer ${newToken}`;
                }
                response = await makeRequest();
            } else {
                this.setAccessToken(null);
                window.location.href = '/';
                throw new Error('Sesión expirada');
            }
        }

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

    async uploadFile<T>(endpoint: string, file: File): Promise<T> {
        const url = `${API_BASE}${endpoint}`;
        const formData = new FormData();
        formData.append('file', file);

        const token = this.getAccessToken();
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al subir archivo' }));
            throw error;
        }
        return response.json();
    }

    downloadFile(endpoint: string): string {
        return `${API_BASE}${endpoint}`;
    }

    private async refreshSession(): Promise<boolean> {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }
        this.refreshPromise = (async() => {
            try {
                const response = await fetch(`${API_BASE}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });
                if(!response.ok){
                    return false;
                }
                const data = await response.json();
                this.accessToken= data.accessToken;
                return true;
            } catch {
                return false;
            } finally {
                this.refreshPromise =null;
            }
        })();
        return this.refreshPromise;
    }
}
export const apiClient = new ApiClient();