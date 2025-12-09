# Guía de Caracterización del Negocio (Módulo de Negocios)

Esta guía documenta los endpoints y el flujo para la gestión de la **Caracterización del Negocio**, permitiendo vincular un Cliente (Asegurado) y una Ubicación con un Corredor de Reaseguros y una Compañía de Seguros.

> **Nota**: Todos los endpoints requieren que el usuario esté autenticado (Token Bearer).

## Base URL
La ruta base para estos endpoints es: `/api/v1/negocios`

---

## 1. Crear un Negocio
Registra una nueva caracterización de negocio. El sistema generará automáticamente un código único con el formato `N{secuencia}C{codigo_cliente}` (ej. `N001C001`).

- **Método**: `POST`
- **URL**: `/`
- **Body (JSON)**:
  ```json
  {
    "asegurado_id": 1,        // ID del Cliente seleccionado
    "ubicacion_id": 5,        // ID de la Ciudad (Ubicación) seleccionada
    "corredor": "Corredor Alpha", // Nombre del Corredor (Seleccionado o escrito)
    "compania": "Seguros Beta"    // Nombre de la Compañía (Seleccionada o escrita)
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "id": 1,
    "codigo": "N001C001",
    "asegurado_id": 1,
    "ubicacion_id": 5,
    "corredor": "Corredor Alpha",
    "compania": "Seguros Beta",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": null
  }
  ```

---

## 2. Listar Negocios
Obtiene la lista de todos los negocios registrados.

- **Método**: `GET`
- **URL**: `/`
- **Respuesta Exitosa (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "codigo": "N001C001",
      "asegurado_id": 1,
      "ubicacion_id": 5,
      "corredor": "Corredor Alpha",
      "compania": "Seguros Beta",
      ...
    }
  ]
  ```

---

## 3. Actualizar un Negocio
Actualiza la información de un negocio existente. 
**Importante**: Cada actualización genera automáticamente una nueva **Versión** en el historial del negocio, preservando los datos tal como estaban en el momento de la actualización.

- **Método**: `PUT`
- **URL**: `/{negocio_id}`
- **Ejemplo**: `/1`
- **Body (JSON)**: (Enviar solo los campos que cambian)
  ```json
  {
    "corredor": "Nuevo Corredor Gamma"
  }
  ```
- **Respuesta Exitosa (200 OK)**: Objeto negocio con los datos actualizados.

---

## 4. Ver Historial de Cambios
Obtiene el historial de versiones de un negocio. Cada vez que se crea o actualiza, se genera una versión.

- **Método**: `GET`
- **URL**: `/{negocio_id}/history`
- **Ejemplo**: `/1/history`
- **Respuesta Exitosa (200 OK)**: Lista de versiones ordenadas de la más reciente a la más antigua.
  ```json
  [
    {
      "version": 2,
      "data": {
        "corredor": "Nuevo Corredor Gamma",
        "compania": "Seguros Beta",
        ...
      },
      "created_at": "2024-02-01T12:00:00Z"
    },
    {
      "version": 1,
      "data": {
        "corredor": "Corredor Alpha",
        "compania": "Seguros Beta",
         ...
      },
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
  ```

---

## Flujo Típico para el Frontend

1.  **Selección de Cliente y Ciudad**:
    - El usuario selecciona un Cliente (`Asegurado`) existente (o crea uno nuevo primero).
    - El usuario selecciona una Ciudad (`Ubicacion`) asociada a ese cliente.
    - Se obtienen sus IDs (`asegurado_id`, `ubicacion_id`).

2.  **Ingreso de Datos de Negocio**:
    - El usuario selecciona (lista ya establecida) el **Corredor de Reaseguros** y la **Compañía de Seguros**.

3.  **Guardar (Crear Negocio)**:
    - Se envía `POST /api/v1/negocios/` con los datos.
    - El backend devuelve el `codigo` generado (ej. `N001C001`).

4.  **Edición y Auditoría**:
    - Si el usuario modifica el negocio posteriormente, se usa `PUT`.
    - Se puede mostrar un botón "Ver Historial" que consuma `GET /.../history` para mostrar la traza de cambios.
