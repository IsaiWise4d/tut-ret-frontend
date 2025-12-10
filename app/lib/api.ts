import { LoginResponse, User, CreateUserData, ApiResponse } from '@/app/types/auth';
import { Asegurado, CreateAseguradoData, Ubicacion, CreateUbicacionData } from '@/app/types/asegurados';
import { Negocio, CreateNegocioData, UpdateNegocioData, NegocioHistory } from '@/app/types/negocios';

import { Slip, CreateSlipData, UpdateSlipData } from '@/app/types/slips';

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
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          // Si es un array de errores (validación), los formateamos
          errorMessage = errorData.detail
            .map((err: any) => {
              const field = err.loc ? err.loc[err.loc.length - 1] : '';
              return field ? `${field}: ${err.msg}` : err.msg;
            })
            .join(', ');
        } else {
          errorMessage = errorData.detail;
        }
      }
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

export async function searchAsegurados(query: string): Promise<Asegurado[]> {
  const response = await fetch(`${API_BASE_URL}/asegurados/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<Asegurado[]>(response);
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

// NEGOCIOS
export async function getNegocios(): Promise<Negocio[]> {
  const response = await fetch(`${API_BASE_URL}/negocios/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Negocio[]>(response);
}

export async function searchNegocios(query: string): Promise<Negocio[]> {
  const response = await fetch(`${API_BASE_URL}/negocios/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Negocio[]>(response);
}

export async function createNegocio(data: CreateNegocioData): Promise<Negocio> {
  const response = await fetch(`${API_BASE_URL}/negocios/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Negocio>(response);
}

export async function updateNegocio(id: number, data: UpdateNegocioData): Promise<Negocio> {
  const response = await fetch(`${API_BASE_URL}/negocios/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Negocio>(response);
}

export async function getNegocioHistory(id: number): Promise<NegocioHistory[]> {
  const response = await fetch(`${API_BASE_URL}/negocios/${id}/history`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<NegocioHistory[]>(response);
}

// SLIPS
export async function getSlips(): Promise<Slip[]> {
  const response = await fetch(`${API_BASE_URL}/slips/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Slip[]>(response);
}

export async function getSlip(id: number): Promise<Slip> {
  const response = await fetch(`${API_BASE_URL}/slips/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Slip>(response);
}

export async function createSlip(data: CreateSlipData): Promise<Slip> {
  const response = await fetch(`${API_BASE_URL}/slips/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Slip>(response);
}

export async function updateSlip(id: number, data: UpdateSlipData): Promise<Slip> {
  const response = await fetch(`${API_BASE_URL}/slips/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Slip>(response);
}

export async function deleteSlip(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/slips/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
     let errorMessage = 'Error al eliminar slip';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch { }
    throw new Error(errorMessage);
  }
}

export async function generateSlipPdf(id: number, retry = true): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/slips/${id}/pdf`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Error al generar el PDF';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;

      // Auto-fix logic for missing limite_indemnizacion
      if (retry && errorMessage.includes('limite_indemnizacion')) {
        try {
          const slip = await getSlip(id);
          // Check if we can fix it
          if (slip.datos_json && slip.datos_json.limite_indemnizacion_valor !== undefined) {
            const newJson = {
              ...slip.datos_json,
              limite_indemnizacion: slip.datos_json.limite_indemnizacion_valor
            };

            // Construct full update data for PUT
            const updateData: UpdateSlipData = {
              tipo_slip: slip.tipo_slip,
              nombre_asegurado: slip.nombre_asegurado,
              vigencia_inicio: slip.vigencia_inicio,
              vigencia_fin: slip.vigencia_fin,
              estado: slip.estado,
              negocio_id: slip.negocio_id,
              datos_json: newJson
            };

            await updateSlip(id, updateData);
            // Retry recursively, but disable further retries
            return generateSlipPdf(id, false);
          }
        } catch (fixError) {
          console.error("Failed to auto-fix slip:", fixError);
        }
      }
    } catch { }
    throw new Error(errorMessage);
  }

  return response.blob();
}

