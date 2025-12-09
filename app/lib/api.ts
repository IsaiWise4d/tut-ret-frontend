import { LoginResponse, User, CreateUserData, ApiResponse } from '@/app/types/auth';
import { Asegurado, CreateAseguradoData, Ubicacion, CreateUbicacionData } from '@/app/types/asegurados';
import { Negocio, CreateNegocioData, UpdateNegocioData, NegocioHistory } from '@/app/types/negocios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para obtener el token
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Helper para obtener el refresh token
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
}

// Helper para guardar tokens
export function setTokens(accessToken: string, refreshToken?: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }
}

// Helper para borrar tokens
export function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  }
}

// Helper para obtener headers con autenticación
function getAuthHeaders(tokenOverride?: string): HeadersInit {
  const token = tokenOverride || getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Custom Event para notificar expiración
export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

function dispatchSessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

// REFRESH TOKEN LOGIC
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

async function refreshAccessToken(): Promise<string> {
   const refreshToken = getRefreshToken();
   if (!refreshToken) {
       throw new Error('No refresh token available');
   }

   const response = await fetch(`${API_BASE_URL}/auth/refresh?refresh_token=${refreshToken}`, {
       method: 'POST',
   });

   if (!response.ok) {
       throw new Error('Refresh failed');
   }

   const data: LoginResponse = await response.json(); // Reusamos LoginResponse o RefreshResponse
   setTokens(data.access_token, data.refresh_token);
   return data.access_token;
}

// Wrapper para fetch con reintento automático
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    let token = getToken();
    let headers = getAuthHeaders(token || undefined);

    // Merge con headers custom si existen
    if (options.headers) {
        headers = { ...headers, ...options.headers };
    }

    const config = { ...options, headers };
    let response = await fetch(url, config);

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await refreshAccessToken();
                isRefreshing = false;
                onRefreshed(newToken);
            } catch (err) {
                isRefreshing = false;
                clearTokens();
                dispatchSessionExpired();
                throw new Error('Session expired');
            }
        }

        // Si falló por 401, esperamos a que se refresque (o falle el refresh) y reintentamos
        const retry = new Promise<Response>((resolve, reject) => {
            addRefreshSubscriber((newToken) => {
                // Actualizar header con nuevo token
                 const retryHeaders = getAuthHeaders(newToken);
                 if (options.headers) {
                     Object.assign(retryHeaders, options.headers);
                 }
                resolve(fetch(url, { ...options, headers: retryHeaders }));
            });
        });

        return retry;
    }

    return response;
}


// Manejo de errores (simplificado, ya que fetchWithAuth maneja el 401 crítico)
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
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
  
  // No usamos handleResponse para login pq queremos manejar tokens manualmente en el componente o aquí
  // Pero el componente espera json directo.
  const data = await response.json();
  if(!response.ok) throw new Error(data.detail || 'Error en login');
  
  return data; 
}

// Obtener el usuario actual
export async function getCurrentUser(): Promise<User> {
  const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
  });

  const apiResponse = await handleResponse<ApiResponse<User>>(response);
  return apiResponse.data;
}

// USERS
export async function getUsers(): Promise<User[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/users/`, {
    method: 'GET',
  });
  const apiResponse = await handleResponse<ApiResponse<User[]>>(response);
  return apiResponse.data;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const response = await fetchWithAuth(`${API_BASE_URL}/users/`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  const apiResponse = await handleResponse<ApiResponse<User>>(response);
  return apiResponse.data;
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
      // Reutilizamos logic de error si es necesario, o dejamos que fetchWithAuth haya manejado auth
      // Pero si es otro error (404, 500) handleResponse lo atraparía si lo llamamos, o check manual
      throw new Error('Error al eliminar usuario');
  }
}

export async function updateUser(userId: number, userData: Partial<CreateUserData>): Promise<User> {
  const response = await fetchWithAuth(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
  const apiResponse = await handleResponse<ApiResponse<User>>(response);
  return apiResponse.data;
}

// ASEGURADOS
export async function getAsegurados(): Promise<Asegurado[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/`, {
    method: 'GET',
  });
  return handleResponse<Asegurado[]>(response);
}

export async function getAsegurado(id: number): Promise<Asegurado> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/${id}`, {
    method: 'GET',
  });
  return handleResponse<Asegurado>(response);
}

export async function createAsegurado(data: CreateAseguradoData): Promise<Asegurado> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse<Asegurado>(response);
}

// UBICACIONES
export async function getUbicaciones(aseguradoId: number): Promise<Ubicacion[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/${aseguradoId}/ubicaciones/`, {
    method: 'GET',
  });
  return handleResponse<Ubicacion[]>(response);
}

export async function createUbicacion(aseguradoId: number, data: CreateUbicacionData): Promise<Ubicacion> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/${aseguradoId}/ubicaciones/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse<Ubicacion>(response);
}

export async function updateAsegurado(id: number, data: Partial<CreateAseguradoData>): Promise<Asegurado> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse<Asegurado>(response);
}

export async function deleteAsegurado(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
     throw new Error('Error al eliminar asegurado');
  }
}

export async function searchAsegurados(query: string): Promise<Asegurado[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
  });
  return handleResponse<Asegurado[]>(response);
}

export async function deleteUbicacion(aseguradoId: number, ubicacionId: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/asegurados/${aseguradoId}/ubicaciones/${ubicacionId}`, {
    method: 'DELETE',
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
  const response = await fetchWithAuth(`${API_BASE_URL}/negocios/`, {
    method: 'GET',
  });
  return handleResponse<Negocio[]>(response);
}

export async function searchNegocios(query: string): Promise<Negocio[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/negocios/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
  });
  return handleResponse<Negocio[]>(response);
}

export async function createNegocio(data: CreateNegocioData): Promise<Negocio> {
  const response = await fetchWithAuth(`${API_BASE_URL}/negocios/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse<Negocio>(response);
}

export async function updateNegocio(id: number, data: UpdateNegocioData): Promise<Negocio> {
  const response = await fetchWithAuth(`${API_BASE_URL}/negocios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse<Negocio>(response);
}

export async function getNegocioHistory(id: number): Promise<NegocioHistory[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/negocios/${id}/history`, {
    method: 'GET',
  });
  return handleResponse<NegocioHistory[]>(response);
}
