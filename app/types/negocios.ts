export interface Negocio {
  id: number;
  codigo: string;
  asegurado_id: number;
  ubicacion_id: number;
  corredor: string;
  compania: string;
  created_at: string;
  updated_at: string | null;
}

export interface CreateNegocioData {
  asegurado_id: number;
  ubicacion_id: number;
  corredor: string;
  compania: string;
}

export interface UpdateNegocioData {
  corredor?: string;
  compania?: string;
}

export interface NegocioHistory {
  version: number;
  data: Negocio;
  created_at: string;
}
