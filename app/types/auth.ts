export type Role = 'SUPER_ADMIN' | 'DATA_ENTRY' | 'FACILITADOR' | 'COTIZADOR';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  full_name?: string;
  is_active: boolean;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
  code: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: Role;
  full_name?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
