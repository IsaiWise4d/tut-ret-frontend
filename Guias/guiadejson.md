{
  "numero_slip": "string",  #es un numero generado automaticamnte
  "tipo_slip": "string",  #es el tipo que ya tenemso claim made, ocurrecia e hibrido
  "nombre_asegurado": "string", #es la razon social del asegurado, que se obtiene de la reacion del neogocio
  "vigencia_inicio": "2025-12-10", #vigencia 
  "vigencia_fin": "2025-12-10", #fin vigencia
  "estado": "Cotizacion",  #estado base
  "negocio_id": 3, #es el id del negocio a cual se relaciona, osea el usuario busca y seleciona el neogocio uqe previamvente ya esat caracterizado

  "datos_json": {
    "reasegurado": {
      "nombre": "string",  #nombre de la compania de reaseguros qeu viene de negocio 
      "direccion": "string"
    },
    "asegurado": {
      "razon_social": "string",  #razon social y direcion proveninetes de la relacion del negocio , osea lo primeor qeu se hace es escoger un negocio
      "identificacion_nit": "string",
      "ubicacion": "string"
    },
    "fecha_inicio": "2025-12-10", #fecha de inicio
    "fecha_fin": "2025-12-10",
    "tipo_cobertura": "CLAIMS_MADE", #el tipo de cobertura, este puede ser 3 , ya sabes cuales son los 3
    "retroactividad": {
      "anios": "string",
      "fecha_inicio": "2025-12-10",
      "fecha_fin": "2025-12-10"
    },
    "gastos_defensa": {
      "porcentaje_limite": 0,
      "sublimite_evento_cop": 0
    },
    "limite_indemnizacion_valor": 0,
    "prima_anual_valor": 0,
    "deducibles": {
      "porcentaje_valor_perdida": 0,
      "minimo_cop": 0,
      "gastos_defensa_texto": "string"
    },
    "descuentos": {
      "porcentaje_total": 0,
      "porcentaje_comision_cedente": 0,
      "porcentaje_intermediario": 0
    },
    "impuestos_nombre_reasegurador": "string",
    "retencion_cedente": {
      "porcentaje": 0,
      "base": 0
    },
    "respaldo_reaseguro": {
      "porcentaje": 0,
      "base": 0
    },
    "garantia_pago_primas_dias": 0,
    "clausula_intermediario": "string"
  }
}