# Guía de Implementación de Autenticación con Refresh Token (Frontend)

Esta guía explica cómo manejar el flujo de autenticación utilizando **Access Tokens** (corta duración) y **Refresh Tokens** (larga duración) para mantener la sesión del usuario activa de forma segura y transparente.

## Conceptos Clave

1.  **Access Token**: Es el token que se envía en el header `Authorization: Bearer <token>` de cada petición. Tiene una vida corta (ej. 30 minutos).
2.  **Refresh Token**: Es un token especial que **solo** sirve para obtener un nuevo Access Token cuando el actual ha expirado. Tiene una vida larga (ej. 1 día).

## Flujo de Autenticación

### 1. Login Inicial
Cuando el usuario inicia sesión, el backend devuelve ambos tokens.

- **Endpoint**: `POST /api/v1/auth/login`
- **Respuesta**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "refresh_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer"
  }
  ```
- **Acción Frontend**: Guardar **ambos** tokens en el almacenamiento seguro (ej. `localStorage`, `sessionStorage` o Cookies HttpOnly).

### 2. Peticiones Normales
En cada petición al backend, envía el `access_token` en el header.

```javascript
headers: {
  Authorization: `Bearer ${accessToken}`
}
```

### 3. Manejo de Expiración (Interceptor)
Cuando el `access_token` expira, el backend responderá con un error **401 Unauthorized**. El frontend debe interceptar este error y tratar de renovar el token automáticamente **antes** de redirigir al usuario al login.

#### Algoritmo Sugerido (Ejemplo con Axios)

1.  Configura un interceptor de respuesta (`axios.interceptors.response`).
2.  Si la respuesta es exitosa, retórnala tal cual.
3.  Si la respuesta es un error **401**:
    a.  Verifica si ya estás intentando renovar el token (para evitar bucles).
    b.  Si no, llama al endpoint de renovación: `POST /api/v1/auth/refresh`.
    c.  Envía el `refresh_token` como query param: `?refresh_token=<tu_refresh_token>`.
    d.  **Si la renovación es exitosa**:
        - Guarda el nuevo `access_token`.
        - Actualiza el header de autorización de la petición original fallida.
        - Reintenta la petición original.
    e.  **Si la renovación falla** (el refresh token también expiró o es inválido):
        - Borra los tokens locales.
        - Redirige al usuario a la pantalla de Login.

### 4. Endpoint de Renovación
- **Método**: `POST`
- **URL**: `/api/v1/auth/refresh`
- **Query Param**: `refresh_token` (String)
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni... (NUEVO)",
    "refresh_token": "eyJhbGciOiJIUzI1Ni... (MISMO O NUEVO)",
    "token_type": "bearer"
  }
  ```

## Ejemplo de Código (Conceptual)

```javascript
import axios from 'axios';

// Instancia de axios
const api = axios.create({ baseURL: 'http://localhost:8000/api/v1' });

// Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos reintentado aún
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // Llamada para renovar token
        const { data } = await axios.post(`http://localhost:8000/api/v1/auth/refresh?refresh_token=${refreshToken}`);

        // Guardar nuevo token
        localStorage.setItem('access_token', data.access_token);

        // Actualizar header y reintentar
        originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, logout forzado
        console.error("Sesión expirada", refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```