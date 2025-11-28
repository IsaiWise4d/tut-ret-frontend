# Guía de Gestión de Usuarios (Backend)

Esta guía documenta los endpoints disponibles para la administración de usuarios en el sistema.

> **IMPORTANTE**: Todos los endpoints listados a continuación (excepto `/me`) están protegidos y requieren que el usuario autenticado tenga el rol **`SUPER_ADMIN`**. Si un usuario con otro rol intenta acceder, recibirá un error `403 Forbidden`.

## Base URL
La ruta base para estos endpoints es: `/api/v1/users`

## Endpoints

### 1. Obtener Información del Usuario Actual
Obtiene los datos del usuario que está realizando la petición (basado en el token).
- **Método**: `GET`
- **URL**: `/me`
- **Permisos**: Cualquier usuario autenticado.

### 2. Listar Usuarios
Obtiene una lista paginada de todos los usuarios registrados.
- **Método**: `GET`
- **URL**: `/`
- **Query Params**:
  - `skip`: (Opcional) Cantidad de registros a saltar (default: 0).
  - `limit`: (Opcional) Cantidad máxima de registros a devolver (default: 100).
- **Permisos**: Solo `SUPER_ADMIN`.

### 3. Crear Usuario
Registra un nuevo usuario en el sistema.
- **Método**: `POST`
- **URL**: `/`
- **Permisos**: Solo `SUPER_ADMIN`.
- **Body (JSON)**:
  ```json
  {
    "username": "nuevo_admin",
    "email": "admin@ejemplo.com",
    "full_name": "Administrador Principal",
    "password": "passwordSeguro123",
    "role": "SUPER_ADMIN",  // Opcional, default: "DATA_ENTRY"
    "is_active": true       // Opcional, default: true
  }
  ```

### 4. Obtener Usuario por ID
Busca un usuario específico por su identificador único.
- **Método**: `GET`
- **URL**: `/{user_id}`
- **Ejemplo**: `/5`
- **Permisos**: Solo `SUPER_ADMIN`.

### 5. Obtener Usuario por Username
Busca un usuario específico por su nombre de usuario.
- **Método**: `GET`
- **URL**: `/username/{username}`
- **Ejemplo**: `/username/juanperez`
- **Permisos**: Solo `SUPER_ADMIN`.

### 6. Actualizar Usuario
Modifica los datos de un usuario existente.
- **Método**: `PUT`
- **URL**: `/{user_id}`
- **Permisos**: Solo `SUPER_ADMIN`.
- **Body (JSON)**:
  Se pueden enviar solo los campos que se desean actualizar.
  ```json
  {
    "full_name": "Juan Perez Actualizado",
    "email": "juan.nuevo@ejemplo.com",
    "role": "DATA_ENTRY",
    "is_active": false
  }
  ```

### 7. Eliminar Usuario
Elimina permanentemente un usuario del sistema.
- **Método**: `DELETE`
- **URL**: `/{user_id}`
- **Permisos**: Solo `SUPER_ADMIN`.

## Roles Disponibles
Actualmente el sistema maneja los siguientes roles (definidos como strings):
- `SUPER_ADMIN`: Acceso total a todos los módulos, incluyendo gestión de usuarios.
- `DATA_ENTRY`: Acceso limitado (por defecto).

## Códigos de Respuesta Comunes
- `200 OK`: Petición exitosa.
- `201 Created`: Recurso creado exitosamente.
- `400 Bad Request`: Error en los datos enviados (ej. email duplicado).
- `401 Unauthorized`: No se envió token o es inválido.
- `403 Forbidden`: El usuario no tiene permisos (no es SUPER_ADMIN).
- `404 Not Found`: Usuario no encontrado.
