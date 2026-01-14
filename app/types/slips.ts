// TIPO SLIP
// Definiciones basadas en GUIA_MODULO_SLIPS.md

export interface Slip {
    id: number;
    numero_slip: string;
    tipo_slip: 'CLAIMS_MADE' | 'OCURRENCIA' | 'HIBRIDO';
    nombre_asegurado: string;
    vigencia_inicio: string; // YYYY-MM-DD
    vigencia_fin: string;    // YYYY-MM-DD
    estado: 'Cotizacion' | 'Aprobado' | 'Rechazado';
    negocio_id?: number | null;
    datos_json: SlipDataJson;
    created_at?: string;
    updated_at?: string;
}

import { User } from "./auth";

export interface SlipHistory {
    id: number;
    slip_id: number;
    estado_anterior: any; // Puede ser Slip o un objeto parcial
    estado_nuevo: any;
    tipo_cambio: 'CREACION' | 'ACTUALIZACION';
    created_at: string;
    created_by_id?: number;
    created_by?: User;
}

// Estructura anidada compleja (datos_json)
export interface SlipDataJson {
    reasegurado: {
        nombre: string;
        direccion: string;
    };
    asegurado: {
        razon_social: string;
        identificacion_nit: string;
        ubicacion: string;
    };
    fecha_inicio: string;
    hora_fecha_inicio?: string;
    fecha_fin: string;
    hora_fecha_fin?: string;
    tipo_cobertura: 'CLAIMS_MADE' | 'OCURRENCIA' | 'HIBRIDO';
    retroactividad?: {
        anios: string;
        fecha_inicio?: string;
        fecha_fin?: string;
    };
    base_cobertura_hibrido?: {
        anios: string;
        fecha: string;
    };
    gastos_defensa?: {
        porcentaje_limite: number;
        sublimite_evento_cop: number;
        gasto_defensa_por_evento?: number;
    };
    limite_indemnizacion_valor: number;
    limite_indemnizacion_claims_made_valor?: number;
    limite_indemnizacion_ocurrencia_valor?: number;
    limite_indemnizacion?: number; // Added for backend compatibility
    prima_anual_valor: number;
    deducibles: {
        porcentaje_valor_perdida: number;
        minimo_cop: number;
        gastos_defensa_porcentaje: number;
    };
    descuentos?: {
        porcentaje_total: number;
        porcentaje_comision_cedente: number;
        porcentaje_intermediario: number;
        comision_fronting?: boolean;
    };
    impuestos_nombre_reasegurador?: string;
    retencion_cedente?: {
        porcentaje?: number;
        base?: number;
    };
    respaldo_reaseguro?: {
        porcentaje: number;
        base: number;
    };
    reserva_primas?: {
        porcentaje: number;
        dias: number;
    };
    garantia_pago_primas_dias: number;
    numero_cuotas?: number;
    valor_cuota?: number;
    cuotas?: { 
        numero: number; 
        fecha: string; 
        valor: number;
        dias_acumulados: number;
    }[];
    clausula_intermediario?: string;
}

// Payload para Crear/Actualizar
export interface CreateSlipData {
    tipo_slip: string;
    nombre_asegurado: string;
    vigencia_inicio: string;
    vigencia_fin: string;
    estado?: string;
    negocio_id?: number | null;
    datos_json: SlipDataJson;
}

export interface UpdateSlipData extends Partial<CreateSlipData> {}
