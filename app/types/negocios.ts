export interface CorredorReaseguros {
  id: number;
  nombre: string;
  direccion?: string;
}

export interface Broker {
  id: number;
  nombre: string;
  direccion?: string;
}

export interface CompaniaSeguros {
  id: number;
  nombre: string;
  direccion?: string;
}

export interface Negocio {
  id: number;
  codigo: string;
  asegurado_id: number;
  ubicacion_id: number;
  corredor_id: number;
  compania_id: number;
  broker_id?: number;
  corredor?: CorredorReaseguros;
  compania?: CompaniaSeguros;
  broker?: Broker;
  created_at: string;
  updated_at: string | null;
}

export interface CreateNegocioData {
  asegurado_id: number;
  ubicacion_id: number;
  corredor_id: number;
  compania_id: number;
  broker_id?: number;
}

export interface UpdateNegocioData {
  corredor_id?: number;
  compania_id?: number;
  broker_id?: number;
}

import { User } from "./auth";

export interface NegocioHistory {
  id: number;
  negocio_id: number;
  estado_anterior: any | null;
  estado_nuevo: any;
  tipo_cambio: string;
  created_at: string;
  created_by_id?: number;
  created_by?: User;
}
