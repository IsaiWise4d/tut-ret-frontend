'use client';

import { useState, useEffect } from 'react';
import { CreateSlipData, Slip } from '@/app/types/slips';
import { Negocio } from '@/app/types/negocios';
import * as api from '@/app/lib/api';

interface SlipFormProps {
    initialData?: Slip;
    onSuccess: () => void;
    onCancel: () => void;
}

// Initial Empty State
const initialSlipData: CreateSlipData = {
    tipo_slip: 'CLAIMS_MADE',
    nombre_asegurado: '',
    vigencia_inicio: '',
    vigencia_fin: '',
    estado: 'Cotizacion',
    negocio_id: null,
    datos_json: {
        reasegurado: { nombre: '', direccion: '' },
        asegurado: { razon_social: '', identificacion_nit: '', ubicacion: '' },
        fecha_inicio: '',
        fecha_fin: '',
        tipo_cobertura: 'CLAIMS_MADE',
        base_cobertura_hibrido: { anios: '', fecha: '' },
        retroactividad: { anios: '', fecha_inicio: '', fecha_fin: '' },
        gastos_defensa: { porcentaje_limite: 0, sublimite_evento_cop: 0 },
        limite_indemnizacion_valor: 0,
        prima_anual_valor: 0,
        deducibles: { porcentaje_valor_perdida: 0, minimo_cop: 0, gastos_defensa_texto: '' },
        descuentos: { porcentaje_total: 0, porcentaje_comision_cedente: 0, porcentaje_intermediario: 0 },
        retencion_cedente: { porcentaje: 0, base: 100 },
        respaldo_reaseguro: { porcentaje: 0, base: 100 },
        garantia_pago_primas_dias: 60
    }
};

// Icons
const Icons = {
    Search: () => (
        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Calendar: () => (
        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Building: () => (
        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Money: () => (
        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Check: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
};

// Searchable Negocio Component
interface NegocioSearchInputProps {
    selectedNegocioId: number | null | undefined;
    onSelect: (negocioId: string) => void;
}

function NegocioSearchInput({ selectedNegocioId, onSelect }: NegocioSearchInputProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Negocio[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedNegocio, setSelectedNegocio] = useState<Negocio | null>(null);
    const [aseguradosMap, setAseguradosMap] = useState<Record<number, string>>({});

    useEffect(() => {
        // Cargar mapa de asegurados para mostrar nombres en la búsqueda
        api.getAsegurados().then(asegurados => {
            const map = asegurados.reduce((acc, curr) => ({
                ...acc,
                [curr.id]: curr.razon_social
            }), {} as Record<number, string>);
            setAseguradosMap(map);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedNegocioId) {
            api.getNegocios().then(negocios => {
                const negocio = negocios.find(n => n.id === selectedNegocioId);
                if (negocio) {
                    setSelectedNegocio(negocio);
                    setSearchQuery(`${negocio.codigo} - ${negocio.compania?.nombre || ''}`);
                }
            });
        }
    }, [selectedNegocioId]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await api.searchNegocios(searchQuery);
                setSearchResults(results);
                setShowDropdown(true);
            } catch (err) {
                console.error('Search error:', err);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelect = (negocio: Negocio) => {
        setSelectedNegocio(negocio);
        setSearchQuery(`${negocio.codigo} - ${negocio.compania?.nombre || ''}`);
        setShowDropdown(false);
        onSelect(negocio.id.toString());
    };

    const handleClear = () => {
        setSelectedNegocio(null);
        setSearchQuery('');
        setSearchResults([]);
        onSelect('');
    };

    return (
        <div className="relative group">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Vincular Negocio (Opcional)
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Search />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                    placeholder="Buscar por código o compañía..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
                    {isSearching && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    )}
                    {selectedNegocio && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-100 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {showDropdown && searchResults.length > 0 && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div className="absolute z-20 mt-2 w-full bg-white border border-zinc-100 rounded-xl shadow-xl max-h-60 overflow-auto ring-1 ring-black/5">
                        {searchResults.map((negocio) => (
                            <button
                                key={negocio.id}
                                type="button"
                                onClick={() => handleSelect(negocio)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-zinc-50 last:border-b-0 transition-colors group/item"
                            >
                                <div className="font-medium text-zinc-900 group-hover/item:text-blue-700">{negocio.codigo}</div>
                                <div className="text-sm text-zinc-500">
                                    <span className="font-medium text-zinc-700">{aseguradosMap[negocio.asegurado_id] || 'Cargando...'}</span>
                                    <span className="mx-1">•</span>
                                    {negocio.compania?.nombre}
                                    <span className="mx-1">•</span>
                                    {negocio.corredor?.nombre}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
            <p className="text-xs text-zinc-500 mt-1.5 ml-1">
                Seleccionar un negocio autocompletará los datos del Asegurado.
            </p>
        </div>
    );
}

// Reusable Components (Moved outside SlipForm)
const Input = ({ label, value, onChange, type = "text", required = false, icon: Icon, placeholder, disabled = false, min, max, step }: any) => {
    const isNumber = type === 'number';
    const hasMin = typeof min === 'number' && Number.isFinite(min);
    const hasMax = typeof max === 'number' && Number.isFinite(max);

    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(() => {
        if (value === null || value === undefined) return '';
        return String(value);
    });

    useEffect(() => {
        if (!isNumber) return;
        if (isFocused) return;
        if (value === null || value === undefined) {
            setInternalValue('');
            return;
        }
        setInternalValue(String(value));
    }, [value, isFocused, isNumber]);

    const clampNumber = (n: number) => {
        let next = n;
        if (hasMin) next = Math.max(min, next);
        if (hasMax) next = Math.min(max, next);
        return next;
    };

    const handleValueChange = (rawValue: string) => {
        if (!isNumber) {
            onChange(rawValue);
            return;
        }

        // Acepta solo números con un punto decimal opcional.
        if (!/^\d*(\.\d*)?$/.test(rawValue)) return;

        setInternalValue(rawValue);

        if (rawValue === '' || rawValue === '.' || rawValue.endsWith('.')) {
            // Estado intermedio de escritura (p.ej. "1.")
            return;
        }

        const parsed = Number(rawValue);
        if (Number.isNaN(parsed)) return;

        const clamped = clampNumber(parsed);
        if (clamped !== parsed) {
            const nextStr = String(clamped);
            setInternalValue(nextStr);
            onChange(nextStr);
            return;
        }

        onChange(rawValue);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!isNumber) return;

        if (internalValue === '' || internalValue === '.' || internalValue.endsWith('.')) {
            // Normaliza estados intermedios al salir.
            const normalized = internalValue === '' ? '' : internalValue.replace(/\.+$/, '');
            if (normalized === '') {
                setInternalValue('');
                return;
            }
            const parsed = Number(normalized);
            if (Number.isNaN(parsed)) return;
            const clamped = clampNumber(parsed);
            const nextStr = String(clamped);
            setInternalValue(nextStr);
            onChange(nextStr);
            return;
        }

        const parsed = Number(internalValue);
        if (Number.isNaN(parsed)) return;
        const clamped = clampNumber(parsed);
        const nextStr = String(clamped);
        setInternalValue(nextStr);
        onChange(nextStr);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isNumber) return;
        // Evita notación científica y signos.
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
    };

    return (
        <div className="group">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon />
                    </div>
                )}
                <input
                    type={type}
                    required={required}
                    value={isNumber ? internalValue : value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                        if (type === 'number') {
                            setIsFocused(true);
                            e.currentTarget.select();
                        }
                    }}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    className={`w-full rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 py-2.5 ${Icon ? 'pl-10' : 'px-4'} ${disabled ? 'opacity-60 cursor-not-allowed bg-zinc-100 text-zinc-500' : ''}`}
                />
            </div>
        </div>
    );
};

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6 border-b border-zinc-100 pb-2">
        <h3 className="text-lg font-semibold text-zinc-800">{title}</h3>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
    </div>
);

function SlipForm({ initialData, onSuccess, onCancel }: SlipFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CreateSlipData>(initialSlipData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                tipo_slip: initialData.tipo_slip,
                nombre_asegurado: initialData.nombre_asegurado,
                vigencia_inicio: initialData.vigencia_inicio,
                vigencia_fin: initialData.vigencia_fin,
                estado: initialData.estado,
                negocio_id: initialData.negocio_id,
                datos_json: initialData.datos_json
            });
        }
    }, [initialData]);

    const handleChange = (field: keyof CreateSlipData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleJsonChange = (category: keyof typeof formData.datos_json | string, field: string | null, value: any) => {
        setFormData(prev => {
            const newJson = { ...prev.datos_json };

            if (field === null) {
                (newJson as any)[category] = value;
            } else {
                (newJson as any)[category] = {
                    ...(newJson as any)[category],
                    [field]: value
                };
            }
            return { ...prev, datos_json: newJson };
        });
    };

    const handleNegocioSelect = async (negocioId: string) => {
        const id = parseInt(negocioId);
        handleChange('negocio_id', id || null);

        if (id) {
            try {
                const [negocios, companias] = await Promise.all([
                    api.getNegocios(),
                    api.getCompaniasSeguros()
                ]);
                const negocio = negocios.find(n => n.id === id);

                if (negocio) {
                    const asegurado = await api.getAsegurado(negocio.asegurado_id);
                    const ubicaciones = await api.getUbicaciones(negocio.asegurado_id);
                    const ubicacion = ubicaciones.find(u => u.id === negocio.ubicacion_id);
                    
                    const compania = companias.find(c => c.id === negocio.compania_id);
                    const nombreCompania = compania ? compania.nombre : '';
                    const direccionCompania = compania?.direccion || '';

                    setFormData(prev => ({
                        ...prev,
                        nombre_asegurado: asegurado.razon_social,
                        datos_json: {
                            ...prev.datos_json,
                            reasegurado: {
                                ...prev.datos_json.reasegurado,
                                nombre: nombreCompania,
                                direccion: direccionCompania
                            },
                            asegurado: {
                                razon_social: asegurado.razon_social,
                                identificacion_nit: asegurado.identificacion,
                                ubicacion: ubicacion ? `${ubicacion.ciudad}, ${ubicacion.direccion}` : 'Desconocida'
                            }
                        }
                    }));
                }
            } catch (e) {
                console.error("Auto-fill failed", e);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Deep copy and sync dates
        const finalData: CreateSlipData = {
            ...formData,
            datos_json: {
                ...formData.datos_json,
                limite_indemnizacion: formData.datos_json.limite_indemnizacion_valor, // Sync for backend compatibility
                fecha_inicio: formData.datos_json.fecha_inicio || formData.vigencia_inicio,
                fecha_fin: formData.datos_json.fecha_fin || formData.vigencia_fin,
                retroactividad: {
                    anios: formData.datos_json.retroactividad?.anios || '',
                    fecha_inicio: formData.datos_json.retroactividad?.fecha_inicio || undefined,
                    fecha_fin: formData.datos_json.retroactividad?.fecha_fin || undefined
                }
            }
        };

        // Clean up retroactividad dates if they are undefined/empty to avoid validation error
        if (finalData.datos_json.retroactividad) {
            if (!finalData.datos_json.retroactividad.fecha_inicio) delete finalData.datos_json.retroactividad.fecha_inicio;
            if (!finalData.datos_json.retroactividad.fecha_fin) delete finalData.datos_json.retroactividad.fecha_fin;
        }

        // Clean up base_cobertura_hibrido if tipo is not HIBRIDO
        if (formData.tipo_slip !== 'HIBRIDO') {
            delete finalData.datos_json.base_cobertura_hibrido;
        }

        try {
            if (initialData) {
                await api.updateSlip(initialData.id, finalData);
            } else {
                await api.createSlip(finalData);
            }
            onSuccess();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al guardar el slip";
            setError(message);
            setIsSubmitting(false);
        }
    };

    const validateStep = (currentStep: number) => {
        const missing: string[] = [];

        const isNonEmpty = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
        const isDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
        const isPositive = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v > 0;
        const isPercent = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v > 0 && v <= 100;

        if (currentStep === 1) {
            if (!isNonEmpty(formData.tipo_slip)) missing.push('Tipo de Slip');
            if (!isNonEmpty(formData.nombre_asegurado)) missing.push('Nombre Asegurado');
            if (!isDate(formData.vigencia_inicio)) missing.push('Vigencia Inicio');
            if (!isDate(formData.vigencia_fin)) missing.push('Vigencia Fin');

            if (formData.tipo_slip === 'HIBRIDO') {
                if (!isNonEmpty(formData.datos_json.base_cobertura_hibrido?.anios)) missing.push('Años (Base Cobertura Híbrido)');
                if (!isDate(formData.datos_json.base_cobertura_hibrido?.fecha)) missing.push('Fecha (Base Cobertura Híbrido)');
            }
        }

        if (currentStep === 2) {
            if (!isNonEmpty(formData.datos_json.asegurado.razon_social)) missing.push('Razón Social');
            if (!isNonEmpty(formData.datos_json.asegurado.identificacion_nit)) missing.push('NIT / Identificación');
            if (!isNonEmpty(formData.datos_json.asegurado.ubicacion)) missing.push('Ubicación');
            if (!isNonEmpty(formData.datos_json.reasegurado.nombre)) missing.push('Nombre Reaseguradora');
            if (!isNonEmpty(formData.datos_json.reasegurado.direccion)) missing.push('Dirección Reaseguradora');
        }

        if (currentStep === 3) {
            if (!isNonEmpty(formData.datos_json.retroactividad?.anios)) missing.push('Retroactividad (Años)');
            if (!isDate(formData.datos_json.retroactividad?.fecha_inicio)) missing.push('Retroactividad (Fecha Inicio)');
            if (!isDate(formData.datos_json.retroactividad?.fecha_fin)) missing.push('Retroactividad (Fecha Fin)');

            if (!isPercent(formData.datos_json.gastos_defensa?.porcentaje_limite)) missing.push('Gastos de Defensa (% Límite: 1-100)');
            if (!isPositive(formData.datos_json.gastos_defensa?.sublimite_evento_cop)) missing.push('Gastos de Defensa (Sublímite COP)');

            if (!isPercent(formData.datos_json.deducibles.porcentaje_valor_perdida)) missing.push('Deducibles (% Pérdida: 1-100)');
            if (!isPositive(formData.datos_json.deducibles.minimo_cop)) missing.push('Deducibles (Mínimo COP)');
            if (!isNonEmpty(formData.datos_json.deducibles.gastos_defensa_texto)) missing.push('Deducibles (Texto Gastos Defensa)');
        }

        if (currentStep === 4) {
            if (!isPositive(formData.datos_json.limite_indemnizacion_valor)) missing.push('Límite Indemnización');
            if (!isPositive(formData.datos_json.prima_anual_valor)) missing.push('Prima Anual');

            if (!isPercent(formData.datos_json.descuentos?.porcentaje_total)) missing.push('Descuentos (% Total: 1-100)');
            if (!isPercent(formData.datos_json.descuentos?.porcentaje_comision_cedente)) missing.push('Descuentos (% Comisión Cedente: 1-100)');
            if (!isPercent(formData.datos_json.descuentos?.porcentaje_intermediario)) missing.push('Descuentos (% Intermediario: 1-100)');

            if (!isPercent(formData.datos_json.retencion_cedente?.porcentaje)) missing.push('Retención Cedente (Porcentaje: 1-100)');
            if (!isPercent(formData.datos_json.respaldo_reaseguro?.porcentaje)) missing.push('Respaldo Reaseguro (Porcentaje: 1-100)');

            if (!isNonEmpty(formData.datos_json.impuestos_nombre_reasegurador)) missing.push('Impuestos (Nombre Reasegurador)');
            if (!isPositive(formData.datos_json.garantia_pago_primas_dias)) missing.push('Garantía Pago Primas (Días)');
            if (!isNonEmpty(formData.datos_json.clausula_intermediario)) missing.push('Cláusula Intermediario');
        }

        if (missing.length > 0) {
            return `Completa los campos requeridos: ${missing.join(', ')}`;
        }

        return null;
    };

    const nextStep = () => {
        const errorMsg = validateStep(step);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }
        setError(null);
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-zinc-100 px-8 py-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900">
                            {initialData ? 'Editar Slip de Reaseguro' : 'Nuevo Slip de Reaseguro'}
                        </h2>
                        <p className="text-zinc-500 mt-1">Complete la información para generar el documento legal.</p>
                    </div>
                    <div className="text-sm font-medium text-zinc-500 bg-zinc-50 px-4 py-2 rounded-lg border border-zinc-100">
                        Paso {step} de 4
                    </div>
                </div>

                {/* Stepper */}
                <div className="relative flex items-center justify-between max-w-7xl mx-auto">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-100 rounded-full -z-10" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500"
                        style={{ width: `${((step - 1) / 3) * 100}%` }} />

                    {[
                        { num: 1, label: 'General' },
                        { num: 2, label: 'Actores' },
                        { num: 3, label: 'Cobertura' },
                        { num: 4, label: 'Reaseguro' }
                    ].map((item) => (
                        <div key={item.num} className="flex flex-col items-center bg-white px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${step >= item.num
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white border-zinc-200 text-zinc-400'
                                }`}>
                                {step > item.num ? <Icons.Check /> : item.num}
                            </div>
                            <span className={`text-xs mt-2 font-medium transition-colors ${step >= item.num ? 'text-blue-700' : 'text-zinc-400'
                                }`}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-8 bg-zinc-50/50">
                <div className="max-w-7xl mx-auto">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 relative z-20">
                                <SectionTitle title="Vinculación" subtitle="Relacionar con un negocio existente." />
                                <NegocioSearchInput
                                    selectedNegocioId={formData.negocio_id}
                                    onSelect={handleNegocioSelect}
                                />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 relative z-10">
                                <SectionTitle title="Información Básica" subtitle="Detalles generales del slip y vigencia." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tipo de Slip *</label>
                                        <select
                                            className="w-full rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 py-2.5 px-4"
                                            value={formData.tipo_slip}
                                            onChange={e => {
                                                handleChange('tipo_slip', e.target.value);
                                                handleJsonChange('tipo_cobertura', null, e.target.value);
                                            }}
                                        >
                                            <option value="CLAIMS_MADE">Claims Made</option>
                                            <option value="OCURRENCIA">Ocurrencia</option>
                                            <option value="HIBRIDO">Híbrido</option>
                                        </select>
                                    </div>
                                    {formData.tipo_slip === 'HIBRIDO' && (
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
                                            <Input
                                                label="Años (Base Cobertura Híbrido)"
                                                value={formData.datos_json.base_cobertura_hibrido?.anios || ''}
                                                onChange={(v: string) => handleJsonChange('base_cobertura_hibrido', 'anios', v)}
                                                placeholder="Ej. 5"
                                                required
                                            />
                                            <Input
                                                type="date"
                                                label="Fecha (Base Cobertura Híbrido)"
                                                value={formData.datos_json.base_cobertura_hibrido?.fecha || ''}
                                                onChange={(v: string) => handleJsonChange('base_cobertura_hibrido', 'fecha', v)}
                                                icon={Icons.Calendar}
                                                required
                                            />
                                        </div>
                                    )}
                                    <Input
                                        label="Nombre Asegurado (Etiqueta)"
                                        value={formData.nombre_asegurado}
                                        onChange={(v: string) => handleChange('nombre_asegurado', v)}
                                        required
                                        icon={Icons.Building}
                                        placeholder="Ej. Constructora Principal S.A."
                                        disabled={!!formData.negocio_id}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <Input
                                        type="date"
                                        label="Vigencia Inicio"
                                        value={formData.vigencia_inicio}
                                        onChange={(v: string) => {
                                            handleChange('vigencia_inicio', v);
                                            handleJsonChange('fecha_inicio', null, v);
                                        }}
                                        required
                                        icon={Icons.Calendar}
                                    />
                                    <Input
                                        type="date"
                                        label="Vigencia Fin"
                                        value={formData.vigencia_fin}
                                        onChange={(v: string) => {
                                            handleChange('vigencia_fin', v);
                                            handleJsonChange('fecha_fin', null, v);
                                        }}
                                        required
                                        icon={Icons.Calendar}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Datos del Asegurado" subtitle="Información legal del cliente." />
                                <div className="grid gap-6">
                                    <Input
                                        label="Razón Social"
                                        value={formData.datos_json.asegurado.razon_social}
                                        onChange={(v: string) => handleJsonChange('asegurado', 'razon_social', v)}
                                        icon={Icons.Building}
                                        disabled={!!formData.negocio_id}
                                        required
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="NIT / Identificación"
                                            value={formData.datos_json.asegurado.identificacion_nit}
                                            onChange={(v: string) => handleJsonChange('asegurado', 'identificacion_nit', v)}
                                            disabled={!!formData.negocio_id}
                                            required
                                        />
                                        <Input
                                            label="Ubicación"
                                            value={formData.datos_json.asegurado.ubicacion}
                                            onChange={(v: string) => handleJsonChange('asegurado', 'ubicacion', v)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Datos del Reasegurado" subtitle="Información de la reaseguradora." />
                                <div className="grid gap-6">
                                    <Input
                                        label="Nombre Reaseguradora"
                                        value={formData.datos_json.reasegurado.nombre}
                                        onChange={(v: string) => handleJsonChange('reasegurado', 'nombre', v)}
                                        icon={Icons.Building}
                                        required
                                    />
                                    <Input
                                        label="Dirección"
                                        value={formData.datos_json.reasegurado.direccion}
                                        onChange={(v: string) => handleJsonChange('reasegurado', 'direccion', v)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Retroactividad" subtitle="Configuración de fechas retroactivas." />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input
                                        label="Años"
                                        value={formData.datos_json.retroactividad?.anios || ''}
                                        onChange={(v: string) => handleJsonChange('retroactividad', 'anios', v)}
                                        placeholder="Ej. 2 años"
                                        required
                                    />
                                    <Input
                                        type="date"
                                        label="Fecha Inicio"
                                        value={formData.datos_json.retroactividad?.fecha_inicio || ''}
                                        onChange={(v: string) => handleJsonChange('retroactividad', 'fecha_inicio', v)}
                                        icon={Icons.Calendar}
                                        required
                                    />
                                    <Input
                                        type="date"
                                        label="Fecha Fin"
                                        value={formData.datos_json.retroactividad?.fecha_fin || ''}
                                        onChange={(v: string) => handleJsonChange('retroactividad', 'fecha_fin', v)}
                                        icon={Icons.Calendar}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Gastos de Defensa" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        type="number"
                                        label="% Límite"
                                        value={formData.datos_json.gastos_defensa?.porcentaje_limite}
                                        onChange={(v: string) => handleJsonChange('gastos_defensa', 'porcentaje_limite', Number(v))}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                    />
                                    <Input
                                        type="number"
                                        label="Sublímite (COP)"
                                        value={formData.datos_json.gastos_defensa?.sublimite_evento_cop}
                                        onChange={(v: string) => handleJsonChange('gastos_defensa', 'sublimite_evento_cop', Number(v))}
                                        icon={Icons.Money}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Deducibles" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        type="number"
                                        label="% Pérdida"
                                        value={formData.datos_json.deducibles.porcentaje_valor_perdida}
                                        onChange={(v: string) => handleJsonChange('deducibles', 'porcentaje_valor_perdida', Number(v))}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                    />
                                    <Input
                                        type="number"
                                        label="Mínimo (COP)"
                                        value={formData.datos_json.deducibles.minimo_cop}
                                        onChange={(v: string) => handleJsonChange('deducibles', 'minimo_cop', Number(v))}
                                        icon={Icons.Money}
                                        required
                                    />
                                </div>
                                <div className="mt-6">
                                    <Input
                                        label="Texto Gastos Defensa"
                                        value={formData.datos_json.deducibles.gastos_defensa_texto}
                                        onChange={(v: string) => handleJsonChange('deducibles', 'gastos_defensa_texto', v)}
                                        placeholder="Ej. Incluidos en el límite"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Valores Económicos" subtitle="Límites y primas del contrato." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        type="number"
                                        label="Límite Indemnización ($)"
                                        value={formData.datos_json.limite_indemnizacion_valor}
                                        onChange={(v: string) => handleJsonChange('limite_indemnizacion_valor', null, Number(v))}
                                        icon={Icons.Money}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        label="Prima Anual ($)"
                                        value={formData.datos_json.prima_anual_valor}
                                        onChange={(v: string) => handleJsonChange('prima_anual_valor', null, Number(v))}
                                        icon={Icons.Money}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Descuentos" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input
                                        type="number"
                                        label="% Total"
                                        value={formData.datos_json.descuentos?.porcentaje_total}
                                        onChange={(v: string) => handleJsonChange('descuentos', 'porcentaje_total', Number(v))}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                    />
                                    <Input
                                        type="number"
                                        label="% Comisión Cedente"
                                        value={formData.datos_json.descuentos?.porcentaje_comision_cedente}
                                        onChange={(v: string) => handleJsonChange('descuentos', 'porcentaje_comision_cedente', Number(v))}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                    />
                                    <Input
                                        type="number"
                                        label="% Intermediario"
                                        value={formData.datos_json.descuentos?.porcentaje_intermediario}
                                        onChange={(v: string) => handleJsonChange('descuentos', 'porcentaje_intermediario', Number(v))}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                    <SectionTitle title="Retención Cedente" />
                                    <Input
                                        type="number"
                                        label="Porcentaje %"
                                        value={formData.datos_json.retencion_cedente?.porcentaje}
                                        onChange={(v: string) => handleJsonChange('retencion_cedente', 'porcentaje', Number(v))}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                    />
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                    <SectionTitle title="Respaldo Reaseguro" />
                                    <Input
                                        type="number"
                                        label="Porcentaje %"
                                        value={formData.datos_json.respaldo_reaseguro?.porcentaje}
                                        onChange={(v: string) => handleJsonChange('respaldo_reaseguro', 'porcentaje', Number(v))}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Otros Detalles" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Impuestos (Nombre Reasegurador)"
                                        value={formData.datos_json.impuestos_nombre_reasegurador || ''}
                                        onChange={(v: string) => handleJsonChange('impuestos_nombre_reasegurador', null, v)}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        label="Garantía Pago Primas (Días)"
                                        value={formData.datos_json.garantia_pago_primas_dias}
                                        onChange={(v: string) => handleJsonChange('garantia_pago_primas_dias', null, parseInt(v))}
                                        required
                                    />
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Cláusula Intermediario *</label>
                                    <textarea
                                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 p-4"
                                        rows={3}
                                        value={formData.datos_json.clausula_intermediario || ''}
                                        onChange={e => handleJsonChange('clausula_intermediario', null, e.target.value)}
                                        placeholder="Ingrese el texto de la cláusula..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white px-8 py-5 border-t border-zinc-100 flex justify-center">
                <div className="flex w-full max-w-3xl items-center justify-center gap-8">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="text-zinc-600 font-medium hover:text-zinc-900 px-6 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                            ← Anterior
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-zinc-500 hover:text-zinc-700 px-6 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}

                    {step < 4 ? (
                        <button
                            key="btn-next"
                            type="button"
                            onClick={nextStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Siguiente →
                        </button>
                    ) : (
                        <button
                            key="btn-submit"
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-2.5 rounded-xl shadow-lg shadow-green-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </span>
                            ) : 'Finalizar y Crear Slip'}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}

export default SlipForm;
