# Guía de Implementación Frontend: Módulo de Slips de Reaseguro

Esta guía detalla cómo consumir la API para la gestión de **Slips de Reaseguro**. Este módulo es crítico ya que maneja una estructura de datos compleja y estricta para generar los documentos legales.

## 1. Resumen del Modelo de Datos

Un "Slip" se compone de dos partes principales:
1.  **Metadatos Planos**: Campos de búsqueda rápida (número, estado, fechas, relación con negocio).
2.  **Detalle Estructurado (`datos_json`)**: Un objeto JSON complejo que contiene toda la información específica del contrato (deducibles, cláusulas, porcentajes).

### Relación con Negocios
Cada Slip puede estar asociado opcionalmente a un **Negocio** existente mediante el campo `negocio_id`.
- El frontend debe permitir seleccionar un negocio existente (dropdown/buscador) al crear el slip.
- Si se selecciona un negocio, se debe enviar su `id` en el campo `negocio_id`.

---

## 2. Endpoints de la API

Base URL: `/api/v1/slips`

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Lista todos los slips (paginado). |
| `GET` | `/{id}` | Obtiene el detalle completo de un slip. |
| `POST` | `/` | Crea un nuevo slip. **Requiere validación estricta**. |
| `PUT` | `/{id}` | Actualiza un slip existente. |
| `DELETE` | `/{id}` | Elimina un slip (Soft delete no implementado, borrado físico). |

---

## 3. Estructura del Payload (POST / PUT)

El frontend debe construir un objeto JSON con la siguiente estructura exacta.

### Campos de Nivel Superior

| Campo | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `numero_slip` | String | Sí | Identificador único (ej: "SL-2025-001"). |
| `tipo_slip` | String | Sí | Valores permitidos: `CLAIMS_MADE`, `OCURRENCIA`, `HIBRIDO`. |
| `nombre_asegurado` | String | Sí | Nombre principal para listados. |
| `vigencia_inicio` | Date | Sí | Formato `YYYY-MM-DD`. |
| `vigencia_fin` | Date | Sí | Formato `YYYY-MM-DD`. |
| `estado` | String | No | Default: "Cotizacion". Opciones: `Cotizacion`, `Aprobado`, `Rechazado`. |
| `negocio_id` | Integer | No | ID del negocio asociado (si aplica). |
| `datos_json` | Object | **Sí** | Objeto complejo detallado a continuación. |

### Estructura de `datos_json` (Crucial)

Este objeto **NO** es un string, es un objeto JSON anidado. El backend validará que cada campo exista y tenga el tipo correcto.

```json
{
  "reasegurado": {
    "nombre": "Texto",
    "direccion": "Texto"
  },
  "asegurado": {
    "razon_social": "Texto",
    "identificacion_nit": "Texto",
    "ubicacion": "Texto"
  },
  "fecha_inicio": "YYYY-MM-DD",
  "fecha_fin": "YYYY-MM-DD",
  "tipo_cobertura": "CLAIMS_MADE", // Debe coincidir con el tipo_slip superior
  "retroactividad": {
    "anios": "Texto (ej: '2 años' o 'Ilimitada')",
    "fecha_inicio": "YYYY-MM-DD", // Opcional
    "fecha_fin": "YYYY-MM-DD"     // Opcional
  },
  "gastos_defensa": {
    "porcentaje_limite": 10.5, // Número (float)
    "sublimite_evento_cop": 50000000 // Número (float)
  },
  "limite_indemnizacion_valor": 1000000000, // Número
  "prima_anual_valor": 25000000, // Número
  "deducibles": {
    "porcentaje_valor_perdida": 10, // Número
    "minimo_cop": 5000000, // Número
    "gastos_defensa_texto": "Texto descriptivo"
  },
  "descuentos": {
    "porcentaje_total": 15,
    "porcentaje_comision_cedente": 10,
    "porcentaje_intermediario": 5
  },
  "impuestos_nombre_reasegurador": "Texto",
  "retencion_cedente": {
    "porcentaje": 20,
    "base": 100
  },
  "respaldo_reaseguro": {
    "porcentaje": 80,
    "base": 100
  },
  "garantia_pago_primas_dias": 60, // Entero
  "clausula_intermediario": "Texto largo de la cláusula"
}
```

---

## 4. Ejemplo Completo de Creación (JSON)

Copia este JSON para probar en Postman o usar como plantilla en el frontend.

```json
{
  "numero_slip": "SL-2025-DEMO-01",
  "tipo_slip": "CLAIMS_MADE",
  "nombre_asegurado": "Constructora Ejemplo S.A.",
  "vigencia_inicio": "2025-01-01",
  "vigencia_fin": "2025-12-31",
  "estado": "Cotizacion",
  "negocio_id": 1, 
  "datos_json": {
    "reasegurado": {
      "nombre": "Reaseguradora Global",
      "direccion": "Calle Financiera 123"
    },
    "asegurado": {
      "razon_social": "Constructora Ejemplo S.A.",
      "identificacion_nit": "900.123.456-7",
      "ubicacion": "Bogotá, Colombia"
    },
    "fecha_inicio": "2025-01-01",
    "fecha_fin": "2025-12-31",
    "tipo_cobertura": "CLAIMS_MADE",
    "retroactividad": {
      "anios": "2 años",
      "fecha_inicio": "2023-01-01",
      "fecha_fin": "2024-12-31"
    },
    "gastos_defensa": {
      "porcentaje_limite": 10.0,
      "sublimite_evento_cop": 50000000.0
    },
    "limite_indemnizacion_valor": 1000000000.0,
    "prima_anual_valor": 25000000.0,
    "deducibles": {
      "porcentaje_valor_perdida": 10.0,
      "minimo_cop": 5000000.0,
      "gastos_defensa_texto": "Incluidos en el límite"
    },
    "descuentos": {
      "porcentaje_total": 15.0,
      "porcentaje_comision_cedente": 10.0,
      "porcentaje_intermediario": 5.0
    },
    "impuestos_nombre_reasegurador": "Reaseguradora Global Inc.",
    "retencion_cedente": {
      "porcentaje": 20.0,
      "base": 100.0
    },
    "respaldo_reaseguro": {
      "porcentaje": 80.0,
      "base": 100.0
    },
    "garantia_pago_primas_dias": 60,
    "clausula_intermediario": "Intermediario autorizado según ley 123."
  }
}
```

---

## 5. Validaciones y Errores Comunes

El backend utiliza **Pydantic V2** para validación estricta.

1.  **Fechas**: Deben enviarse siempre como strings `YYYY-MM-DD`.
    *   *Error*: `Object of type date is not JSON serializable` -> Significa que el backend intentó guardar un objeto fecha. (Ya solucionado en el backend, pero el frontend debe enviar strings).
    *   *Error*: `Input should be a valid date` -> El formato de fecha es incorrecto (ej: DD/MM/YYYY fallará).

2.  **Tipos Numéricos**:
    *   Los campos de dinero y porcentajes (`float`) aceptan decimales.
    *   `garantia_pago_primas_dias` debe ser un entero (`int`).

3.  **Campos Faltantes**:
    *   Si falta algún campo obligatorio dentro de `datos_json` (ej: `gastos_defensa`), la API responderá con un error `422 Unprocessable Entity` indicando exactamente qué campo falta.

## 6. Recomendaciones para la UI

1.  **Formulario por Pasos (Wizard)**: Dado que el objeto `datos_json` es grande, se recomienda dividir el formulario en pasos:
    *   Paso 1: Datos Generales (Número, Fechas, Negocio).
    *   Paso 2: Actores (Asegurado, Reasegurado).
    *   Paso 3: Coberturas y Económicos (Límites, Primas, Deducibles).
    *   Paso 4: Reaseguro y Otros (Retenciones, Garantías).

2.  **Autocompletado**:
    *   Al seleccionar un `negocio_id`, el frontend podría pre-llenar los datos del `asegurado` dentro de `datos_json` usando la información del endpoint de Negocios.

3.  **Manejo de Fechas**:
    *   Usar selectores de fecha (Datepickers) que retornen siempre `YYYY-MM-DD`.
