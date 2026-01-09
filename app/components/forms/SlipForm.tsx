'use client';

import { useState, useEffect, useContext } from 'react';
import { CreateSlipData, Slip } from '@/app/types/slips';
import { Negocio } from '@/app/types/negocios';
import * as api from '@/app/lib/api';
import { AuthContext } from '@/app/context/AuthContext';

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
        hora_fecha_inicio: '00:00',
        fecha_fin: '',
        hora_fecha_fin: '24:00',
        tipo_cobertura: 'CLAIMS_MADE',
        retroactividad: { anios: '', fecha_inicio: '', fecha_fin: '' },
        gastos_defensa: { porcentaje_limite: 0, sublimite_evento_cop: 0, gasto_defensa_por_evento: 0 },
        limite_indemnizacion_valor: 0,
        limite_indemnizacion_claims_made_valor: 0,
        limite_indemnizacion_ocurrencia_valor: 0,
        prima_anual_valor: 0,
        deducibles: { porcentaje_valor_perdida: 0, minimo_cop: 0, gastos_defensa_porcentaje: 0 },
        descuentos: { porcentaje_total: 0, porcentaje_comision_cedente: 0, porcentaje_intermediario: 0, comision_fronting: false },
        retencion_cedente: { porcentaje: 0, base: 100 },
        respaldo_reaseguro: { porcentaje: 0, base: 100 },
        reserva_primas: { porcentaje: 20, dias: 30 },
        garantia_pago_primas_dias: 60,
        numero_cuotas: 1,
        valor_cuota: 0
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

// Toast Component
const Toast = ({ messages, onClose }: { messages: string[], onClose: () => void }) => {
    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [messages, onClose]);

    if (messages.length === 0) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full bg-white border border-zinc-200 border-l-4 border-l-red-500 shadow-2xl rounded-xl pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1 pt-1">
                        <h3 className="text-sm font-semibold text-zinc-900">
                            Por favor corrige los siguientes errores
                        </h3>
                        <ul className="mt-2 text-sm text-zinc-600 list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                            {messages.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                        <button
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                            onClick={onClose}
                        >
                            <span className="sr-only">Cerrar</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 8.586 5.707 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Components (Moved outside SlipForm)
const Input = ({ label, value, onChange, type = "text", required = false, icon: Icon, placeholder, disabled = false, min, max, step, isCurrency = false, hasError = false, defaultValue }: any) => {
    const isNumber = type === 'number' || isCurrency;
    const hasMin = typeof min === 'number' && Number.isFinite(min);
    const hasMax = typeof max === 'number' && Number.isFinite(max);

    const isModified = defaultValue !== undefined && value !== defaultValue;

    const [isFocused, setIsFocused] = useState(false);
    
    const formatCurrency = (val: string) => {
        if (!val) return '';
        const clean = val.replace(/\./g, '');
        return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [internalValue, setInternalValue] = useState<string>(() => {
        if (value === null || value === undefined) return '';
        if (isCurrency) return formatCurrency(String(value));
        return String(value);
    });

    useEffect(() => {
        if (!isNumber) return;
        if (isFocused) return;
        if (value === null || value === undefined) {
            setInternalValue('');
            return;
        }
        if (isCurrency) {
            setInternalValue(formatCurrency(String(value)));
        } else {
            setInternalValue(String(value));
        }
    }, [value, isFocused, isNumber, isCurrency]);

    const clampNumber = (n: number) => {
        let next = n;
        if (hasMin) next = Math.max(min, next);
        if (hasMax) next = Math.min(max, next);
        return next;
    };

    const handleValueChange = (rawValue: string) => {
        if (isCurrency) {
            // Remove dots to check if it's a valid number
            const clean = rawValue.replace(/\./g, '');
            if (!/^\d*$/.test(clean)) return;

            const formatted = formatCurrency(clean);
            setInternalValue(formatted);
            onChange(clean);
            return;
        }

        if (!isNumber) {
            onChange(rawValue);
            return;
        }

        // Normalizar coma a punto para decimales
        const normalizedValue = rawValue.replace(/,/g, '.');

        // Acepta solo números con un punto decimal opcional.
        if (!/^\d*(\.\d*)?$/.test(normalizedValue)) return;

        setInternalValue(normalizedValue);

        if (normalizedValue === '' || normalizedValue === '.' || normalizedValue.endsWith('.')) {
            // Estado intermedio de escritura (p.ej. "1.")
            return;
        }

        const parsed = Number(normalizedValue);
        if (Number.isNaN(parsed)) return;

        const clamped = clampNumber(parsed);
        if (clamped !== parsed) {
            const nextStr = String(clamped);
            setInternalValue(nextStr);
            onChange(nextStr);
            return;
        }

        onChange(normalizedValue);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!isNumber) return;

        if (isCurrency) {
            // Ensure formatting on blur
            setInternalValue(formatCurrency(internalValue));
            return;
        }

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
            <div className="flex justify-between items-center mb-1.5">
                <label className={`block text-sm font-medium ${hasError ? 'text-red-600' : 'text-zinc-700'}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {isModified && (
                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Modificado
                    </span>
                )}
            </div>
            <div className="relative">
                {Icon && (
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${hasError ? 'text-red-400' : ''}`}>
                        <Icon />
                    </div>
                )}
                <input
                    type={isCurrency ? 'text' : type}
                    required={required}
                    value={isNumber ? internalValue : value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                        if (type === 'number' || isCurrency) {
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
                    className={`w-full rounded-xl transition-all duration-200 py-2.5 ${Icon ? 'pl-10' : 'px-4'} ${
                        hasError 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-red-900 placeholder-red-300' 
                            : 'border-zinc-200 bg-zinc-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    } ${disabled ? 'opacity-60 cursor-not-allowed bg-zinc-100 text-zinc-500' : ''}`}
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
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CreateSlipData>(initialSlipData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastErrors, setToastErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());
    const [isDirty, setIsDirty] = useState(false);

    // Auto-calculate valor_cuota
    useEffect(() => {
        const prima = formData.datos_json.prima_anual_valor || 0;
        const retencionCedente = formData.datos_json.retencion_cedente?.porcentaje || 0;
        const descuentoTotal = formData.datos_json.descuentos?.porcentaje_total || 0;
        const cuotas = formData.datos_json.numero_cuotas || 1;

        if (cuotas > 0) {
            // Apply retention deductions first
            const primaDespuesRetencion = prima * (1 - (retencionCedente / 100));
            
            // Apply discounts on the remaining amount
            const netPremium = primaDespuesRetencion * (1 - (descuentoTotal / 100));
            
            const valorCuota = Math.round(netPremium / cuotas);
            
            if (valorCuota !== formData.datos_json.valor_cuota) {
                setFormData(prev => ({
                    ...prev,
                    datos_json: {
                        ...prev.datos_json,
                        valor_cuota: valorCuota
                    }
                }));
            }
        }
    }, [
        formData.datos_json.prima_anual_valor,
        formData.datos_json.retencion_cedente?.porcentaje,
        formData.datos_json.descuentos?.porcentaje_total,
        formData.datos_json.numero_cuotas
    ]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Sync Ocurrencia limit with Total limit for HIBRIDO slips
    useEffect(() => {
        if (formData.tipo_slip === 'HIBRIDO' && 
            formData.datos_json.limite_indemnizacion_valor !== formData.datos_json.limite_indemnizacion_ocurrencia_valor) {
            setFormData(prev => ({
                ...prev,
                datos_json: {
                    ...prev.datos_json,
                    limite_indemnizacion_ocurrencia_valor: prev.datos_json.limite_indemnizacion_valor
                }
            }));
        }
    }, [formData.tipo_slip, formData.datos_json.limite_indemnizacion_valor, formData.datos_json.limite_indemnizacion_ocurrencia_valor]);

    useEffect(() => {
        if (initialData) {
            // Lógica para inferir el estado de fronting si no está explícitamente guardado
            // Si comision_fronting no existe, pero el porcentaje es 0, asumimos que es fronting
            const currentDescuentos = initialData.datos_json.descuentos || { porcentaje_total: 0, porcentaje_comision_cedente: 0, porcentaje_intermediario: 0 };
            const isFronting = currentDescuentos.comision_fronting !== undefined 
                ? currentDescuentos.comision_fronting 
                : (currentDescuentos.porcentaje_comision_cedente === 0);

            setFormData({
                tipo_slip: initialData.tipo_slip,
                nombre_asegurado: initialData.nombre_asegurado,
                vigencia_inicio: initialData.vigencia_inicio,
                vigencia_fin: initialData.vigencia_fin,
                estado: initialData.estado,
                negocio_id: initialData.negocio_id,
                datos_json: {
                    ...initialData.datos_json,
                    descuentos: {
                        ...currentDescuentos,
                        comision_fronting: isFronting
                    }
                }
            });
        }
    }, [initialData]);

    const handleChange = (field: keyof CreateSlipData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
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
        setIsDirty(true);
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
                            },
                            impuestos_nombre_reasegurador: nombreCompania
                        }
                    }));
                }
            } catch (e) {
                console.error("Auto-fill failed", e);
            }
        }
    };

    const handleDelete = async () => {
        if (!initialData?.id) return;
        
        if (!window.confirm('¿Estás seguro de que deseas eliminar este Slip? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            setIsSubmitting(true);
            await api.deleteSlip(initialData.id);
            onSuccess(); // Refresh list
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar el slip";
            setError(message);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate current step before submitting
        const { isValid, errors, failedFields } = validateStep(step);
        if (!isValid) {
            setFieldErrors(new Set(failedFields));
            setToastErrors(errors);
            return;
        }
        setFieldErrors(new Set());
        setToastErrors([]);

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
                },
                retencion_cedente: {
                    ...formData.datos_json.retencion_cedente,
                    base: 100
                },
                respaldo_reaseguro: {
                    porcentaje: formData.datos_json.respaldo_reaseguro?.porcentaje || 0,
                    base: 100
                }
            }
        };

        // Clean up retroactividad dates if they are undefined/empty to avoid validation error
        if (finalData.datos_json.retroactividad) {
            if (!finalData.datos_json.retroactividad.fecha_inicio) delete finalData.datos_json.retroactividad.fecha_inicio;
            // Force fecha_fin to be vigencia_inicio
            finalData.datos_json.retroactividad.fecha_fin = formData.vigencia_inicio;
        }

        // Clean up base_cobertura_hibrido if tipo is not HIBRIDO
        if (formData.tipo_slip !== 'HIBRIDO') {
            delete finalData.datos_json.base_cobertura_hibrido;
            delete finalData.datos_json.limite_indemnizacion_ocurrencia_valor;
            delete finalData.datos_json.limite_indemnizacion_claims_made_valor;
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
        const errors: string[] = [];
        const failedFields: string[] = [];

        const isNonEmpty = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
        const isDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
        const isPositive = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v > 0;
        const isPercent = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100;

        if (currentStep === 1) {
            if (!isNonEmpty(formData.tipo_slip)) { errors.push('Tipo de Slip es requerido'); failedFields.push('tipo_slip'); }
            if (!isNonEmpty(formData.nombre_asegurado)) { errors.push('Nombre Asegurado es requerido'); failedFields.push('nombre_asegurado'); }
            if (!isDate(formData.vigencia_inicio)) { errors.push('Vigencia Inicio es requerida'); failedFields.push('vigencia_inicio'); }
            if (!isDate(formData.vigencia_fin)) { errors.push('Vigencia Fin es requerida'); failedFields.push('vigencia_fin'); }

            if (isDate(formData.vigencia_inicio) && isDate(formData.vigencia_fin)) {
                if (formData.vigencia_fin <= formData.vigencia_inicio) {
                    errors.push('La Vigencia Fin debe ser posterior a la Vigencia Inicio');
                    failedFields.push('vigencia_fin');
                }
            }
        }

        if (currentStep === 2) {
            if (!isNonEmpty(formData.datos_json.asegurado.razon_social)) { errors.push('Razón Social es requerida'); failedFields.push('asegurado.razon_social'); }
            if (!isNonEmpty(formData.datos_json.asegurado.identificacion_nit)) { errors.push('NIT / Identificación es requerido'); failedFields.push('asegurado.identificacion_nit'); }
            if (!isNonEmpty(formData.datos_json.asegurado.ubicacion)) { errors.push('Ubicación es requerida'); failedFields.push('asegurado.ubicacion'); }
            if (!isNonEmpty(formData.datos_json.reasegurado.nombre)) { errors.push('Nombre Reaseguradora es requerido'); failedFields.push('reasegurado.nombre'); }
            if (!isNonEmpty(formData.datos_json.reasegurado.direccion)) { errors.push('Dirección Reaseguradora es requerida'); failedFields.push('reasegurado.direccion'); }
        }

        if (currentStep === 3) {
            if (formData.tipo_slip !== 'OCURRENCIA') {
                if (!isNonEmpty(formData.datos_json.retroactividad?.anios)) { errors.push('Retroactividad (Años) es requerido'); failedFields.push('retroactividad.anios'); }
                if (!isDate(formData.datos_json.retroactividad?.fecha_inicio)) { errors.push('Retroactividad (Fecha Inicio) es requerida'); failedFields.push('retroactividad.fecha_inicio'); }
                // Fecha Fin is now auto-calculated from Vigencia Inicio, so we check if Vigencia Inicio is set (which is checked in step 1)
                // But we can check if the calculation is valid (start < end)
                if (isDate(formData.datos_json.retroactividad?.fecha_inicio) && isDate(formData.vigencia_inicio)) {
                     if (formData.vigencia_inicio <= formData.datos_json.retroactividad!.fecha_inicio!) {
                        errors.push('Retroactividad: La Fecha Inicio debe ser anterior a la Vigencia Inicio');
                        failedFields.push('retroactividad.fecha_inicio');
                    }
                }
            }

            if (!isPositive(formData.datos_json.limite_indemnizacion_valor)) { errors.push('Límite Indemnización es requerido'); failedFields.push('limite_indemnizacion_valor'); }

            if (!isPercent(formData.datos_json.gastos_defensa?.porcentaje_limite)) { errors.push('Gastos de Defensa (% Límite) debe ser un número entre 0 y 100'); failedFields.push('gastos_defensa.porcentaje_limite'); }
            if (!isPositive(formData.datos_json.gastos_defensa?.sublimite_evento_cop)) { errors.push('Gastos de Defensa (Sublímite COP) es requerido'); failedFields.push('gastos_defensa.sublimite_evento_cop'); }

            if (!isPercent(formData.datos_json.deducibles.porcentaje_valor_perdida)) { errors.push('Deducibles (% Pérdida) debe ser un número entre 0 y 100'); failedFields.push('deducibles.porcentaje_valor_perdida'); }
            if (!isPositive(formData.datos_json.deducibles.minimo_cop)) { errors.push('Deducibles (Mínimo COP) es requerido'); failedFields.push('deducibles.minimo_cop'); }
            if (!isPercent(formData.datos_json.deducibles.gastos_defensa_porcentaje)) { errors.push('Deducibles (Gastos Defensa %) debe ser un número entre 0 y 100'); failedFields.push('deducibles.gastos_defensa_porcentaje'); }
        }

        if (currentStep === 4) {
            if (formData.tipo_slip === 'HIBRIDO') {
                if (!isPositive(formData.datos_json.limite_indemnizacion_ocurrencia_valor)) { errors.push('Límite Indemnización (Ocurrencia) es requerido'); failedFields.push('limite_indemnizacion_ocurrencia_valor'); }
                if (!isPositive(formData.datos_json.limite_indemnizacion_claims_made_valor)) { errors.push('Límite Indemnización (Claims Made) es requerido'); failedFields.push('limite_indemnizacion_claims_made_valor'); }

                const ocurrencia = formData.datos_json.limite_indemnizacion_ocurrencia_valor || 0;
                const claims = formData.datos_json.limite_indemnizacion_claims_made_valor || 0;
                
                if (claims > ocurrencia) {
                    errors.push('El sublímite Claims Made no puede exceder el Límite de Ocurrencia');
                    failedFields.push('limite_indemnizacion_claims_made_valor');
                }
            }
            
            if (!isPositive(formData.datos_json.prima_anual_valor)) { errors.push('Prima Anual es requerida'); failedFields.push('prima_anual_valor'); }

            if (!isPercent(formData.datos_json.descuentos?.porcentaje_total)) { errors.push('Descuentos (% Total) debe ser un número entre 0 y 100'); failedFields.push('descuentos.porcentaje_total'); }
            
            if (!isPercent(formData.datos_json.descuentos?.porcentaje_comision_cedente)) {
                errors.push('Descuentos (% Comisión Cedente) debe ser un número entre 0 y 100');
                failedFields.push('descuentos.porcentaje_comision_cedente');
            }

            if (!isPercent(formData.datos_json.descuentos?.porcentaje_intermediario)) { errors.push('Descuentos (% Intermediario) debe ser un número entre 0 y 100'); failedFields.push('descuentos.porcentaje_intermediario'); }

            if (!isPercent(formData.datos_json.retencion_cedente?.porcentaje)) { errors.push('Retención Cedente (Porcentaje) debe ser un número entre 0 y 100'); failedFields.push('retencion_cedente.porcentaje'); }
            if (!isPercent(formData.datos_json.respaldo_reaseguro?.porcentaje)) { errors.push('Respaldo Reaseguro (Porcentaje) debe ser un número entre 0 y 100'); failedFields.push('respaldo_reaseguro.porcentaje'); }

            if (!isNonEmpty(formData.datos_json.impuestos_nombre_reasegurador)) { errors.push('Impuestos (Nombre Reasegurador) es requerido'); failedFields.push('impuestos_nombre_reasegurador'); }
            if (!isPositive(formData.datos_json.garantia_pago_primas_dias)) { errors.push('Garantía Pago Primas (Días) es requerido'); failedFields.push('garantia_pago_primas_dias'); }
            if (!isNonEmpty(formData.datos_json.clausula_intermediario)) { errors.push('Cláusula Intermediario es requerida'); failedFields.push('clausula_intermediario'); }
        }

        return { isValid: errors.length === 0, errors, failedFields };
    };

    const nextStep = () => {
        const { isValid, errors, failedFields } = validateStep(step);
        if (!isValid) {
            setFieldErrors(new Set(failedFields));
            setToastErrors(errors);
            return;
        }
        setFieldErrors(new Set());
        setToastErrors([]);
        setError(null);
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const handleCancel = () => {
        if (isDirty) {
            if (window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')) {
                onCancel();
            }
        } else {
            onCancel();
        }
    };

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
                                                const val = e.target.value;
                                                handleChange('tipo_slip', val);
                                                handleJsonChange('tipo_cobertura', null, val);
                                                if (val === 'OCURRENCIA') {
                                                    handleJsonChange('retroactividad', null, null);
                                                }
                                            }}
                                        >
                                            <option value="CLAIMS_MADE">Claims Made</option>
                                            <option value="OCURRENCIA">Ocurrencia</option>
                                            <option value="HIBRIDO">Híbrido</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Nombre Asegurado (Etiqueta)"
                                        value={formData.nombre_asegurado}
                                        onChange={(v: string) => handleChange('nombre_asegurado', v)}
                                        required
                                        icon={Icons.Building}
                                        placeholder="Ej. Constructora Principal S.A."
                                        disabled={!!formData.negocio_id}
                                        hasError={fieldErrors.has('nombre_asegurado')}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
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
                                                hasError={fieldErrors.has('vigencia_inicio')}
                                            />
                                        </div>
                                        <div className="w-28">
                                            <label className="block text-sm font-medium mb-1.5 text-zinc-700">Hora</label>
                                            <select
                                                value={formData.datos_json.hora_fecha_inicio || '00:00'}
                                                onChange={(e) => handleJsonChange('hora_fecha_inicio', null, e.target.value)}
                                                className="w-full rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 py-2.5 px-3"
                                            >
                                                <option value="00:00">00:00</option>
                                                <option value="24:00">24:00</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
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
                                                hasError={fieldErrors.has('vigencia_fin')}
                                            />
                                        </div>
                                        <div className="w-28">
                                            <label className="block text-sm font-medium mb-1.5 text-zinc-700">Hora</label>
                                            <select
                                                value={formData.datos_json.hora_fecha_fin || '24:00'}
                                                onChange={(e) => handleJsonChange('hora_fecha_fin', null, e.target.value)}
                                                className="w-full rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 py-2.5 px-3"
                                            >
                                                <option value="00:00">00:00</option>
                                                <option value="24:00">24:00</option>
                                            </select>
                                        </div>
                                    </div>
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
                                        hasError={fieldErrors.has('asegurado.razon_social')}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="NIT / Identificación"
                                            value={formData.datos_json.asegurado.identificacion_nit}
                                            onChange={(v: string) => handleJsonChange('asegurado', 'identificacion_nit', v)}
                                            disabled={!!formData.negocio_id}
                                            required
                                            hasError={fieldErrors.has('asegurado.identificacion_nit')}
                                        />
                                        <Input
                                            label="Ubicación"
                                            value={formData.datos_json.asegurado.ubicacion}
                                            onChange={(v: string) => handleJsonChange('asegurado', 'ubicacion', v)}
                                            required
                                            hasError={fieldErrors.has('asegurado.ubicacion')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Datos del Reasegurado" subtitle="Información de la reaseguradora." />
                                <div className="grid gap-6">
                                    <Input
                                        label="Nombre"
                                        value={formData.datos_json.reasegurado.nombre}
                                        onChange={(v: string) => handleJsonChange('reasegurado', 'nombre', v)}
                                        icon={Icons.Building}
                                        required
                                        hasError={fieldErrors.has('reasegurado.nombre')}
                                    />
                                    <Input
                                        label="Dirección"
                                        value={formData.datos_json.reasegurado.direccion}
                                        onChange={(v: string) => handleJsonChange('reasegurado', 'direccion', v)}
                                        required
                                        hasError={fieldErrors.has('reasegurado.direccion')}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {formData.tipo_slip !== 'OCURRENCIA' && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                    <SectionTitle title="Retroactividad" subtitle="Configuración de fechas retroactivas." />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Input
                                            label="Años"
                                            value={formData.datos_json.retroactividad?.anios || ''}
                                            onChange={() => {}} // Read-only
                                            placeholder="Calculado automáticamente"
                                            required
                                            disabled={true}
                                            hasError={fieldErrors.has('retroactividad.anios')}
                                        />
                                        <Input
                                            type="date"
                                            label="Fecha Inicio"
                                            value={formData.datos_json.retroactividad?.fecha_inicio || ''}
                                            onChange={(v: string) => {
                                                handleJsonChange('retroactividad', 'fecha_inicio', v);
                                                
                                                // Calculate years, months, days automatically
                                                if (v && formData.vigencia_inicio) {
                                                    const parseDate = (str: string) => {
                                                        const [y, m, d] = str.split('-').map(Number);
                                                        return new Date(y, m - 1, d);
                                                    };

                                                    const start = parseDate(v);
                                                    const end = parseDate(formData.vigencia_inicio);
                                                    
                                                    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                                                        if (end < start) {
                                                            handleJsonChange('retroactividad', 'anios', `0 años, 0 meses, 0 días`);
                                                            return;
                                                        }

                                                        let years = end.getFullYear() - start.getFullYear();
                                                        let months = end.getMonth() - start.getMonth();
                                                        let days = end.getDate() - start.getDate();

                                                        if (days < 0) {
                                                            months--;
                                                            // Días en el mes anterior al mes final
                                                            const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0); 
                                                            days += prevMonth.getDate();
                                                        }

                                                        if (months < 0) {
                                                            years--;
                                                            months += 12;
                                                        }
                                                        
                                                        handleJsonChange('retroactividad', 'anios', `${years} años, ${months} meses, ${days} días`);
                                                    }
                                                }
                                            }}
                                            icon={Icons.Calendar}
                                            required
                                            hasError={fieldErrors.has('retroactividad.fecha_inicio')}
                                        />
                                        <Input
                                            type="date"
                                            label="Fecha Fin"
                                            value={formData.vigencia_inicio} // Use vigencia_inicio as Fecha Fin
                                            onChange={() => {}} // Read-only
                                            icon={Icons.Calendar}
                                            required
                                            disabled={true}
                                            hasError={fieldErrors.has('retroactividad.fecha_fin')}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Límite de Indemnización" subtitle="Valores asegurados." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        type="number"
                                        label={formData.tipo_slip === 'HIBRIDO' ? "Límite Indemnización Total ($)" : "Límite Indemnización ($)"}
                                        value={formData.datos_json.limite_indemnizacion_valor}
                                        onChange={(v: string) => {
                                            const val = Number(v);
                                            handleJsonChange('limite_indemnizacion_valor', null, val);
                                            // Auto-calculate sublimit
                                            const pct = formData.datos_json.gastos_defensa?.porcentaje_limite || 0;
                                            const sub = Math.round(val * (pct / 100));
                                            handleJsonChange('gastos_defensa', 'sublimite_evento_cop', sub);
                                        }}
                                        icon={Icons.Money}
                                        required
                                        isCurrency
                                        hasError={fieldErrors.has('limite_indemnizacion_valor')}
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
                                        onChange={(v: string) => {
                                            const pct = Number(v);
                                            handleJsonChange('gastos_defensa', 'porcentaje_limite', pct);
                                            // Auto-calculate sublimit
                                            const limit = formData.datos_json.limite_indemnizacion_valor || 0;
                                            const sub = Math.round(limit * (pct / 100));
                                            handleJsonChange('gastos_defensa', 'sublimite_evento_cop', sub);
                                        }}
                                        required
                                        min={0}
                                        max={100}
                                        step={1}
                                        hasError={fieldErrors.has('gastos_defensa.porcentaje_limite')}
                                    />
                                    <Input
                                        type="number"
                                        label="Sublímite (COP)"
                                        value={formData.datos_json.gastos_defensa?.sublimite_evento_cop}
                                        onChange={(v: string) => {}} // Read-only
                                        icon={Icons.Money}
                                        required
                                        isCurrency
                                        disabled={true}
                                        hasError={fieldErrors.has('gastos_defensa.sublimite_evento_cop')}
                                    />
                                    <Input
                                        type="number"
                                        label="Gasto de Defensa por Evento"
                                        value={formData.datos_json.gastos_defensa?.gasto_defensa_por_evento}
                                        onChange={(v: string) => handleJsonChange('gastos_defensa', 'gasto_defensa_por_evento', Number(v))}
                                        icon={Icons.Money}
                                        isCurrency
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
                                        step={1}
                                        hasError={fieldErrors.has('deducibles.porcentaje_valor_perdida')}
                                    />
                                    <Input
                                        type="number"
                                        label="Mínimo (COP)"
                                        value={formData.datos_json.deducibles.minimo_cop}
                                        onChange={(v: string) => handleJsonChange('deducibles', 'minimo_cop', Number(v))}
                                        icon={Icons.Money}
                                        required
                                        isCurrency
                                        hasError={fieldErrors.has('deducibles.minimo_cop')}
                                    />
                                </div>
                                <div className="mt-6">
                                    <Input
                                        type="number"
                                        label="Gastos Defensa (%)"
                                        value={formData.datos_json.deducibles.gastos_defensa_porcentaje}
                                        onChange={(v: string) => handleJsonChange('deducibles', 'gastos_defensa_porcentaje', Number(v))}
                                        min={0}
                                        max={100}
                                        step={1}
                                        required
                                        hasError={fieldErrors.has('deducibles.gastos_defensa_porcentaje')}
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
                                    {formData.tipo_slip === 'HIBRIDO' && (
                                        <>
                                            <Input
                                                type="number"
                                                label="Límite Único y Combinado (Ocurrencia)"
                                                value={formData.datos_json.limite_indemnizacion_ocurrencia_valor || 0}
                                                onChange={() => {}}
                                                icon={Icons.Money}
                                                required
                                                isCurrency
                                                disabled={true}
                                                hasError={fieldErrors.has('limite_indemnizacion_ocurrencia_valor')}
                                            />
                                            <Input
                                                type="number"
                                                label="Límite Único y Combinado (Claims Made)"
                                                value={formData.datos_json.limite_indemnizacion_claims_made_valor || 0}
                                                onChange={(v: string) => handleJsonChange('limite_indemnizacion_claims_made_valor', null, Number(v))}
                                                icon={Icons.Money}
                                                required
                                                isCurrency
                                                hasError={fieldErrors.has('limite_indemnizacion_claims_made_valor')}
                                            />
                                        </>
                                    )}
                                    <Input
                                        type="number"
                                        label="Prima Anual ($)"
                                        value={formData.datos_json.prima_anual_valor}
                                        onChange={(v: string) => handleJsonChange('prima_anual_valor', null, Number(v))}
                                        icon={Icons.Money}
                                        required
                                        isCurrency
                                        hasError={fieldErrors.has('prima_anual_valor')}
                                    />
                                </div>
                                {formData.tipo_slip === 'HIBRIDO' && (
                                    <div className={`mt-4 p-4 rounded-lg border ${
                                        (formData.datos_json.limite_indemnizacion_claims_made_valor || 0) > 
                                        (formData.datos_json.limite_indemnizacion_ocurrencia_valor || 0)
                                        ? 'bg-red-50 border-red-200 text-red-700' 
                                        : 'bg-blue-50 border-blue-200 text-blue-700'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium">Control de Límites:</span>
                                        </div>
                                        <p className="mt-1 text-sm">
                                            Sublímite Claims Made: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
                                                formData.datos_json.limite_indemnizacion_claims_made_valor || 0
                                            )}
                                            {' / '}
                                            Límite Ocurrencia: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(formData.datos_json.limite_indemnizacion_ocurrencia_valor || 0)}
                                        </p>
                                        {(formData.datos_json.limite_indemnizacion_claims_made_valor || 0) > 
                                          (formData.datos_json.limite_indemnizacion_ocurrencia_valor || 0) && (
                                            <p className="mt-1 text-sm font-bold">
                                                ⚠️ El sublímite Claims Made excede el límite de Ocurrencia.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Descuentos de Reaseguro" />
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input
                                        type="number"
                                        label="% Total"
                                        value={formData.datos_json.descuentos?.porcentaje_total}
                                        onChange={() => {}}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                        disabled={true}
                                        hasError={fieldErrors.has('descuentos.porcentaje_total')}
                                    />
                                    <Input
                                        type="number"
                                        label="% Comisión Cedente"
                                        value={formData.datos_json.descuentos?.porcentaje_comision_cedente}
                                        onChange={(v: string) => {
                                            let val = Number(v);
                                            const intermediario = formData.datos_json.descuentos?.porcentaje_intermediario || 0;
                                            
                                            if (val + intermediario > 100) {
                                                val = 100 - intermediario;
                                            }
                                            
                                            handleJsonChange('descuentos', 'porcentaje_comision_cedente', val);
                                            handleJsonChange('descuentos', 'porcentaje_total', val + intermediario);
                                        }}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                        hasError={fieldErrors.has('descuentos.porcentaje_comision_cedente')}
                                    />
                                    <Input
                                        type="number"
                                        label="% Intermediario"
                                        value={formData.datos_json.descuentos?.porcentaje_intermediario}
                                        onChange={(v: string) => {
                                            let val = Number(v);
                                            const cedente = formData.datos_json.descuentos?.porcentaje_comision_cedente || 0;
                                            
                                            if (val + cedente > 100) {
                                                val = 100 - cedente;
                                            }

                                            handleJsonChange('descuentos', 'porcentaje_intermediario', val);
                                            handleJsonChange('descuentos', 'porcentaje_total', cedente + val);
                                        }}
                                        required
                                        min={0}
                                        max={100}
                                        step={0.01}
                                        hasError={fieldErrors.has('descuentos.porcentaje_intermediario')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                    <SectionTitle title="Retención Cedente" />
                                    <div className="space-y-4">
                                        <Input
                                            type="number"
                                            label="Porcentaje %"
                                            value={formData.datos_json.retencion_cedente?.porcentaje}
                                            onChange={(v: string) => {
                                                const val = Number(v);
                                                handleJsonChange('retencion_cedente', 'porcentaje', val);
                                                handleJsonChange('respaldo_reaseguro', 'porcentaje', 100 - val);
                                            }}
                                            required
                                            min={0}
                                            max={100}
                                            step={1}
                                            hasError={fieldErrors.has('retencion_cedente.porcentaje')}
                                        />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                    <SectionTitle title="Respaldo Reaseguro" />
                                    <div className="space-y-4">
                                        <Input
                                            type="number"
                                            label="Porcentaje %"
                                            value={formData.datos_json.respaldo_reaseguro?.porcentaje}
                                            onChange={(v: string) => handleJsonChange('respaldo_reaseguro', 'porcentaje', Number(v))}
                                            required
                                            min={0}
                                            max={100}
                                            step={1}
                                            disabled={true}
                                            hasError={fieldErrors.has('respaldo_reaseguro.porcentaje')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Reserva de Primas" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        type="number"
                                        label="Porcentaje (%)"
                                        value={formData.datos_json.reserva_primas?.porcentaje || 0}
                                        onChange={(v: string) => handleJsonChange('reserva_primas', 'porcentaje', parseFloat(v))}
                                        min={0}
                                        max={100}
                                        step={1}
                                        defaultValue={20}
                                    />
                                    <Input
                                        type="number"
                                        label="Días"
                                        value={formData.datos_json.reserva_primas?.dias || 0}
                                        onChange={(v: string) => handleJsonChange('reserva_primas', 'dias', parseInt(v))}
                                        min={0}
                                        defaultValue={30}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Impuestos" />
                                <Input
                                    label="IMPUESTOS A CARGO DEL REASEGURADOR"
                                    value={formData.datos_json.impuestos_nombre_reasegurador || ''}
                                    onChange={(v: string) => handleJsonChange('impuestos_nombre_reasegurador', null, v)}
                                    required
                                    hasError={fieldErrors.has('impuestos_nombre_reasegurador')}
                                />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Garantía de Pago" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input
                                        type="number"
                                        label="Garantía Pago Primas (Días)"
                                        value={formData.datos_json.garantia_pago_primas_dias}
                                        onChange={(v: string) => handleJsonChange('garantia_pago_primas_dias', null, parseInt(v))}
                                        required
                                        hasError={fieldErrors.has('garantia_pago_primas_dias')}
                                        defaultValue={60}
                                    />
                                    <Input
                                        type="number"
                                        label="Número de Cuotas"
                                        value={formData.datos_json.numero_cuotas}
                                        onChange={(v: string) => handleJsonChange('numero_cuotas', null, parseInt(v))}
                                        min={1}
                                        max={48}
                                        step={1}
                                        defaultValue={1}
                                    />
                                    <Input
                                        type="number"
                                        label="Valor Cuota"
                                        value={formData.datos_json.valor_cuota}
                                        onChange={() => {}} // Read-only
                                        icon={Icons.Money}
                                        isCurrency
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                <SectionTitle title="Intermediario" />
                                <div className="mt-4">
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
            
            <Toast messages={toastErrors} onClose={() => setToastErrors([])} />

            {/* Footer */}
            <div className="bg-white px-8 py-5 border-t border-zinc-100 flex justify-center">
                <div className="flex w-full max-w-3xl items-center justify-center gap-8">
                    {initialData && user?.role === 'SUPER_ADMIN' && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="text-red-500 hover:text-red-700 font-medium px-6 py-2.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Eliminar
                        </button>
                    )}

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
                            onClick={handleCancel}
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
