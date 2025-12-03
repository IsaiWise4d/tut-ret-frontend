import { LoginResponse, User, CreateUserData, ApiResponse } from '@/app/types/auth';
import { Asegurado, CreateAseguradoData, Ubicacion, CreateUbicacionData } from '@/app/types/asegurados';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para obtener el token
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Helper para obtener headers con autenticación
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Manejo de errores
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    if (response.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }
    
    let errorMessage = 'Error en la petición';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Si no se puede parsear el error, usar mensaje genérico
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
}

// AUTH
export async function login(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (response.status === 401) {
    throw new Error('Credenciales incorrectas. Por favor verifica tu usuario y contraseña.');
  }

  return handleResponse<LoginResponse>(response);
}

// Obtener el usuario actual
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const apiResponse = await handleResponse<ApiResponse<User>>(response);
  return apiResponse.data;
}

// USERS
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  // Asumimos que la lista de usuarios también viene envuelta
  const apiResponse = await handleResponse<ApiResponse<User[]>>(response);
  return apiResponse.data;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  const apiResponse = await handleResponse<ApiResponse<User>>(response);
  return apiResponse.data;
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al eliminar usuario');
  }
}

export async function updateUser(userId: number, userData: Partial<CreateUserData>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  const apiResponse = await handleResponse<ApiResponse<User>>(response);
  return apiResponse.data;
}

// ASEGURADOS
export async function getAsegurados(): Promise<Asegurado[]> {
  const response = await fetch(`${API_BASE_URL}/asegurados/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<Asegurado[]>(response);
}

export async function getAsegurado(id: number): Promise<Asegurado> {
  const response = await fetch(`${API_BASE_URL}/asegurados/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<Asegurado>(response);
}

export async function createAsegurado(data: CreateAseguradoData): Promise<Asegurado> {
  const response = await fetch(`${API_BASE_URL}/asegurados/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Asegurado>(response);
}

// UBICACIONES
export async function getUbicaciones(aseguradoId: number): Promise<Ubicacion[]> {
  const response = await fetch(`${API_BASE_URL}/asegurados/${aseguradoId}/ubicaciones/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<Ubicacion[]>(response);
}

export async function createUbicacion(aseguradoId: number, data: CreateUbicacionData): Promise<Ubicacion> {
  const response = await fetch(`${API_BASE_URL}/asegurados/${aseguradoId}/ubicaciones/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Ubicacion>(response);
}

export async function updateAsegurado(id: number, data: Partial<CreateAseguradoData>): Promise<Asegurado> {
  const response = await fetch(`${API_BASE_URL}/asegurados/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Asegurado>(response);
}

export async function deleteAsegurado(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/asegurados/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al eliminar asegurado');
  }
}

export async function deleteUbicacion(aseguradoId: number, ubicacionId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/asegurados/${aseguradoId}/ubicaciones/${ubicacionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Error al eliminar ubicación';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Si no se puede parsear el error, usar mensaje genérico
    }
    throw new Error(errorMessage);
  }
}
