import { apiClient }from './api';
import type { Task } from '../types'

export const taskService = {
    async getAll(): Promise<Task[]> {
        return apiClient.get<Task[]>('/tasks');
    },
    
    async create(name:string,description?:string,priority?:number): Promise<Task> {
        return apiClient.post<Task>('/tasks', {
            name,
            description,
            priority
        });
    },
    async updateStatus(taskId:string,completed:boolean): Promise<Task> {
        return apiClient.patch<Task>(`/tasks/${taskId}/status`, { completed});
    },
    async delete(taskId:string): Promise<void> {
        return apiClient.delete(`/tasks/${taskId}`);
    },
};