# Guía de Autenticación para Frontend

Esta guía explica cómo interactuar con el sistema de autenticación del backend (API) desde el frontend.

## Resumen
El sistema utiliza **JWT (JSON Web Tokens)**.
1. El usuario se loguea y recibe un `access_token`.
2. El frontend guarda este token (ej. en `localStorage` o `cookies`).
3. Para acceder a rutas protegidas, el frontend debe enviar este token en los **Headers** de cada petición.

---

## 1. Login (Iniciar Sesión)

Para obtener el token, debes enviar las credenciales del usuario.

- **Endpoint:** `POST /api/v1/auth/login`
- **Content-Type:** `application/x-www-form-urlencoded` (Form Data estándar de OAuth2)
- **Body:**
  - `username`: (string) El nombre de usuario.
  - `password`: (string) La contraseña.

### Ejemplo de Petición (JavaScript / Fetch)

```javascript
async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error en login');
    }

    const data = await response.json();
    console.log('Login exitoso:', data);
    
    // Guardar el token para usarlo después
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

### Respuesta Exitosa (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 2. Acceder a Rutas Protegidas

Una vez que tienes el `access_token`, debes incluirlo en el header `Authorization` de tus peticiones a rutas privadas (como obtener usuarios, crear registros, etc.).

- **Header:** `Authorization: Bearer <TU_TOKEN>`

### Ejemplo de Petición Autenticada

```javascript
async function getUsers() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('No hay token, el usuario no está logueado');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/v1/users/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // IMPORTANTE: Espacio después de Bearer
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      console.log('Token inválido o expirado');
      // Aquí podrías redirigir al login
      return;
    }

    const data = await response.json();
    console.log('Usuarios:', data);
  } catch (error) {
    console.error(error);
  }
}
```

---

## 3. Endpoints Disponibles

### Usuarios (Requiere ser Admin)
- `GET /api/v1/users/`: Listar todos los usuarios.
- `POST /api/v1/users/`: Crear un nuevo usuario.
- `GET /api/v1/users/{id}`: Obtener un usuario por ID.
- `PUT /api/v1/users/{id}`: Actualizar un usuario.
- `DELETE /api/v1/users/{id}`: Eliminar un usuario.

### Errores Comunes
- **401 Unauthorized**: No enviaste el token, el token expiró o es inválido.
- **403 Forbidden**: Tienes un token válido, pero tu usuario no tiene permisos para hacer esa acción (ej. un usuario normal intentando crear otro usuario).
