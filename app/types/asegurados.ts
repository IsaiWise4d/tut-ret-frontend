// Tipos para Asegurados
export interface Asegurado {
  id: number;
  razon_social: string;
  identificacion: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  ubicaciones: Ubicacion[];
}

export interface CreateAseguradoData {
  razon_social: string;
  identificacion: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
}

// Tipos para Ubicaciones
export interface Ubicacion {
  id: number;
  ciudad: string;
  pais: string;
  direccion?: string;
  telefono?: string;
  asegurado_id: number;
}

export interface CreateUbicacionData {
  ciudad: string;
  pais: string;
  direccion?: string;
  telefono?: string;
}
