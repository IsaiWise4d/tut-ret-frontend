# Guía de Gestión de Asegurados y Ubicaciones

Esta guía documenta los endpoints disponibles para la gestión de **Asegurados** y sus respectivas **Ubicaciones**.

> **Nota**: Todos los endpoints requieren que el usuario esté autenticado (Token Bearer).

## Base URL
La ruta base para estos endpoints es: `/api/v1/asegurados`

---

## 1. Gestión de Asegurados

### 1.1. Crear un Asegurado
Registra un nuevo asegurado en el sistema.

- **Método**: `POST`
- **URL**: `/`
- **Body (JSON)**:
  ```json
  {
    "razon_social": "Empresa S.A.",
    "identificacion": "1234567890",
    "nombre": "Juan Pérez",
    "correo": "contacto@empresa.com"   // Opcional
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "razon_social": "Empresa S.A.",
    "identificacion": "1234567890",
    "nombre": "Juan Pérez",
    "correo": "contacto@empresa.com",
    "id": 1,
    "ubicaciones": []
  }
  ```
- **Errores Comunes**:
  - `400 Bad Request`: Si ya existe un asegurado con esa identificación.

### 1.2. Listar Asegurados
Obtiene la lista de todos los asegurados registrados.

- **Método**: `GET`
- **URL**: `/`
- **Query Params**:
  - `skip`: (Opcional) Registros a saltar (paginación). Default: 0.
  - `limit`: (Opcional) Límite de registros. Default: 100.
- **Respuesta Exitosa (200 OK)**:
  ```json
  [
    {
      "razon_social": "Empresa S.A.",
      "identificacion": "1234567890",
      "nombre": "Juan Pérez",
      "correo": "contacto@empresa.com",
      "id": 1,
      "ubicaciones": []
    },
    ...
  ]
  ```

### 1.3. Obtener Asegurado por ID
Obtiene el detalle de un asegurado específico.

- **Método**: `GET`
- **URL**: `/{asegurado_id}`
- **Ejemplo**: `/1`
- **Respuesta Exitosa (200 OK)**: Retorna el objeto asegurado completo.
- **Errores Comunes**:
  - `404 Not Found`: Si el asegurado no existe.

---

## 2. Gestión de Ubicaciones

Las ubicaciones pertenecen a un asegurado específico. Para crear o listar ubicaciones, necesitas el `id` del asegurado.

### 2.1. Crear Ubicación para un Asegurado
Agrega una nueva ubicación a un asegurado existente.

- **Método**: `POST`
- **URL**: `/{asegurado_id}/ubicaciones/`
- **Ejemplo**: `/1/ubicaciones/`
- **Body (JSON)**:
  ```json
  {
    "ciudad": "Bogotá",
    "pais": "Colombia",
    "direccion": "Av. Principal 123",
    "telefono": "+57 300 123 4567"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "ciudad": "Bogotá",
    "pais": "Colombia",
    "direccion": "Av. Principal 123",
    "telefono": "+57 300 123 4567",
    "id": 5,
    "asegurado_id": 1
  }
  ```
- **Errores Comunes**:
  - `404 Not Found`: Si el asegurado con el ID indicado no existe.

### 2.2. Listar Ubicaciones de un Asegurado
Obtiene todas las ubicaciones asociadas a un asegurado.

- **Método**: `GET`
- **URL**: `/{asegurado_id}/ubicaciones/`
- **Ejemplo**: `/1/ubicaciones/`
- **Respuesta Exitosa (200 OK)**:
  ```json
  [
    {
      "ciudad": "Bogotá",
      "pais": "Colombia",
      "direccion": "Av. Principal 123",
      "telefono": "+57 300 123 4567",
      "id": 5,
      "asegurado_id": 1
    },
    {
      "ciudad": "Medellín",
      "pais": "Colombia",
      "direccion": "Calle 10 # 20-30",
      "telefono": "+57 300 987 6543",
      "id": 6,
      "asegurado_id": 1
    }
  ]
  ```

---

## Flujo Típico para el Frontend

1.  **Crear Asegurado**: El usuario llena el formulario de asegurado -> `POST /api/v1/asegurados/`.
2.  **Obtener ID**: De la respuesta del paso 1, guardas el `id` del nuevo asegurado (ej. `id: 15`).
3.  **Agregar Ubicaciones**: Si el formulario permite agregar ubicaciones inmediatamente, usas ese ID para hacer peticiones `POST /api/v1/asegurados/15/ubicaciones/` por cada ubicación agregada.
