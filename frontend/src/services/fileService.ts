import { apiClient } from './api';
import type { File } from '../types';

export const fileService = {
  async upload(taskId: string, file: File): Promise<File> {
    return apiClient.uploadFile<File>(`/tasks/${taskId}/files`, file);
  },

  getDownloadUrl(fileId: string): string {
    return apiClient.downloadFile(`/files/${fileId}`);
  },

  async delete(fileId: string): Promise<void> {
    return apiClient.delete(`/files/${fileId}`);
  },
};