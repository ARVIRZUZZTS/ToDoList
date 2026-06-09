export interface User {
  user_id: string;
  name: string;
  email: string;
}

export interface Task {
  task_id: string;
  name: string;
  description: string | null;
  completed: boolean;
  priority: number;
  created_at: string;
  File?: File[];
}

export interface File {
  file_id: string;
  name: string;
  path: string;
  uploaded_at: string;
  last_download_at: string | null;
  size?: number;
  mimetype?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}