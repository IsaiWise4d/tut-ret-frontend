'use client';

import { useState, useEffect } from 'react';
import { Asegurado, Ubicacion } from '@/app/types/asegurados';
import { Negocio, CreateNegocioData, UpdateNegocioData } from '@/app/types/negocios';
import { getUbicaciones, createNegocio, updateNegocio, searchAsegurados } from '@/app/lib/api';
import { CORREDORES, COMPANIAS } from '@/app/data/negociosData';

interface NegocioFormProps {
    initialData?: Negocio;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function NegocioForm({ initialData, onSuccess, onCancel }: NegocioFormProps) {
    // Form states
    const [aseguradoId, setAseguradoId] = useState<number>(initialData?.asegurado_id || 0);
    const [ubicacionId, setUbicacionId] = useState<number>(initialData?.ubicacion_id || 0);
    const [corredor, setCorredor] = useState(initialData?.corredor || '');
    const [compania, setCompania] = useState(initialData?.compania || '');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Asegurado[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedAsegurado, setSelectedAsegurado] = useState<Asegurado | null>(null);

    // Data states
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [fetchingUbicaciones, setFetchingUbicaciones] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!initialData;

    // Search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2 && !selectedAsegurado) {
                setSearching(true);
                try {
                    const results = await searchAsegurados(searchQuery);
                    setSearchResults(results);
                    setShowResults(true);
                } catch (err) {
                    console.error(err);
                } finally {
                    setSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedAsegurado]);

    // Fetch Ubicaciones when Asegurado changes
    useEffect(() => {
        if (aseguradoId) {
            const fetchUbicaciones = async () => {
                setFetchingUbicaciones(true);
                try {
                    const data = await getUbicaciones(aseguradoId);
                    setUbicaciones(data);

                    if (initialData && initialData.asegurado_id === aseguradoId) {
                        setUbicacionId(initialData.ubicacion_id);
                    } else {
                        setUbicacionId(0);
                    }
                } catch (err: any) {
                    console.error(err);
                    setUbicaciones([]);
                } finally {
                    setFetchingUbicaciones(false);
                }
            };
            fetchUbicaciones();
        } else {
            setUbicaciones([]);
        }
    }, [aseguradoId]);

    const handleSelectAsegurado = (asegurado: Asegurado) => {
        setSelectedAsegurado(asegurado);
        setAseguradoId(asegurado.id);
        setSearchQuery(asegurado.razon_social);
        setShowResults(false);
    };

    const clearSelection = () => {
        setSelectedAsegurado(null);
        setAseguradoId(0);
        setSearchQuery('');
        setUbicaciones([]);
        setUbicacionId(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEditing && initialData) {
                const updateData: UpdateNegocioData = {
                    corredor,
                    compania,
                };
                await updateNegocio(initialData.id, updateData);
            } else {
                const createData: CreateNegocioData = {
                    asegurado_id: aseguradoId,
                    ubicacion_id: ubicacionId,
                    corredor,
                    compania
                };
                await createNegocio(createData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al guardar el negocio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-2xl shadow-xl max-w-3xl mx-auto border border-zinc-100">
            <div className="border-b border-gray-100 pb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                    {isEditing ? 'Editar Negocio' : 'Nuevo Negocio'}
                </h2>
                <p className="mt-2 text-base text-gray-500">
                    Complete la información para caracterizar el negocio.
                </p>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-8">

                {/* Asegurado Search */}
                <div className="relative">
                    <label htmlFor="asegurado" className="block text-base font-bold text-gray-800 mb-2">
                        Cliente (Asegurado)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search-asegurado"
                            disabled={isEditing}
                            className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-4 px-5 ${isEditing ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 focus:bg-white transition-colors duration-200'}`}
                            placeholder="Buscar por Razón Social o ID..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (selectedAsegurado) {
                                    setSelectedAsegurado(null); // Reset selection if typing again
                                    setAseguradoId(0);
                                }
                            }}
                            autoComplete="off"
                        />
                        {selectedAsegurado && !isEditing && (
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        {searching && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>

                    {showResults && (
                        <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {searchResults.length === 0 ? (
                                <li className="relative cursor-default select-none py-3 pl-5 pr-9 text-gray-500">
                                    No se encontraron resultados.
                                </li>
                            ) : (
                                searchResults.map((asegurado) => (
                                    <li
                                        key={asegurado.id}
                                        className="relative cursor-pointer select-none py-3 pl-5 pr-9 text-gray-900 hover:bg-blue-50 transition-colors"
                                        onClick={() => handleSelectAsegurado(asegurado)}
                                    >
                                        <span className="block truncate font-semibold text-lg">{asegurado.razon_social}</span>
                                        <span className="block truncate text-sm text-gray-500">ID: {asegurado.identificacion}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                    {isEditing && <p className="mt-2 text-sm text-gray-500">El cliente no se puede cambiar en edición.</p>}
                </div>

                {/* Ubicacion */}
                <div>
                    <label htmlFor="ubicacion" className="block text-base font-bold text-gray-800 mb-2">
                        Ubicación (Ciudad)
                    </label>
                    <div className="relative">
                        <select
                            id="ubicacion"
                            disabled={isEditing || !aseguradoId || fetchingUbicaciones}
                            value={ubicacionId}
                            onChange={(e) => setUbicacionId(Number(e.target.value))}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-4 px-5 bg-gray-50 focus:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500 appearance-none"
                            required
                        >
                            <option value={0}>
                                {fetchingUbicaciones ? 'Cargando ubicaciones...' : (aseguradoId ? 'Seleccione una Ubicación' : 'Seleccione un cliente primero')}
                            </option>
                            {ubicaciones.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.ciudad} - {u.direccion}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {isEditing && <p className="mt-2 text-sm text-gray-500">La ubicación no se puede cambiar en edición.</p>}
                </div>

                {/* Corredor */}
                <div>
                    <label htmlFor="corredor" className="block text-base font-bold text-gray-800 mb-2">
                        Corredor de Reaseguros
                    </label>
                    <div className="relative">
                        <select
                            id="corredor"
                            value={corredor}
                            onChange={(e) => setCorredor(e.target.value)}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-4 px-5 bg-gray-50 focus:bg-white transition-colors duration-200 appearance-none"
                            required
                        >
                            <option value="">Seleccione un Corredor</option>
                            {CORREDORES.map((c) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Compania */}
                <div>
                    <label htmlFor="compania" className="block text-base font-bold text-gray-800 mb-2">
                        Compañía de Seguros
                    </label>
                    <div className="relative">
                        <select
                            id="compania"
                            value={compania}
                            onChange={(e) => setCompania(e.target.value)}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-4 px-5 bg-gray-50 focus:bg-white transition-colors duration-200 appearance-none"
                            required
                        >
                            <option value="">Seleccione una Compañía</option>
                            {COMPANIAS.map((c) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-end space-x-4 border-t border-gray-100 pt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading || !aseguradoId || !ubicacionId}
                    className="inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-200"
                >
                    {loading ? 'Guardando...' : (isEditing ? 'Actualizar Negocio' : 'Crear Negocio')}
                </button>
            </div>
        </form>
    );
}
