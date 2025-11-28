'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import * as api from '@/app/lib/api';
import { Asegurado, CreateAseguradoData, CreateUbicacionData, Ubicacion } from '@/app/types/asegurados';

export default function AseguradosPage() {
    return (
        <ProtectedRoute>
            <AseguradosContent />
        </ProtectedRoute>
    );
}

function AseguradosContent() {
    const [asegurados, setAsegurados] = useState<Asegurado[]>([]);
    const [selected Asegurado, setSelectedAsegurado] = useState<Asegurado | null>(null);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [todasUbicaciones, setTodasUbicaciones] = useState<Ubicacion[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados de búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Asegurado[]>([]);

    // Estados para formulario de asegurado
    const [showAseguradoForm, setShowAseguradoForm] = useState(false);
    const [editingAsegurado, setEditingAsegurado] = useState<Asegurado | null>(null);
    const [aseguradoFormData, setAseguradoFormData] = useState<CreateAseguradoData>({
        razon_social: '',
        identificacion: '',
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
    });
    const [aseguradoFormError, setAseguradoFormError] = useState('');
    const [isSubmittingAsegurado, setIsSubmittingAsegurado] = useState(false);

    // Estados para formulario de ubicación
    const [showUbicacionForm, setShowUbicacionForm] = useState(false);
    const [modoUbicacion, setModoUbicacion] = useState<'select' | 'manual'>('select');
    const [ubicacionFormData, setUbicacionFormData] = useState<CreateUbicacionData>({
        ciudad: '',
        pais: '',
    });
    const [ubicacionFormError, setUbicacionFormError] = useState('');
    const [isSubmittingUbicacion, setIsSubmittingUbicacion] = useState(false);

    // Cargar asegurados
    const loadAsegurados = async () => {
        try {
            setIsLoading(true);
            const data = await api.getAsegurados();
            setAsegurados(data);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar asegurados');
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar ubicaciones de un asegurado
    const loadUbicaciones = async (aseguradoId: number) => {
        try {
            const data = await api.getUbicaciones(aseguradoId);
            setUbicaciones(data);
        } catch (err) {
            console.error('Error al cargar ubicaciones:', err);
        }
    };

    // Cargar todas las ubicaciones
    const loadTodasUbicaciones = async () => {
        try {
            const allUbis: Ubicacion[] = [];
            for (const aseg of asegurados) {
                const ubis = await api.getUbicaciones(aseg.id);
                allUbis.push(...ubis);
            }
            const unicas = allUbis.filter((ubi, index, self) =>
                index === self.findIndex((u) => u.ciudad === ubi.ciudad && u.pais === ubi.pais)
            );
            setTodasUbicaciones(unicas);
        } catch (err) {
            console.error('Error al cargar todas las ubicaciones:', err);
        }
    };

    useEffect(() => {
        loadAsegurados();
    }, []);

    useEffect(() => {
        if (asegurados.length > 0) {
            loadTodasUbicaciones();
        }
    }, [asegurados]);

    // Buscar asegurados por identificación
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const results = asegurados.filter(aseg =>
            aseg.identificacion.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
    }, [searchQuery, asegurados]);

    // Manejar selección de asegurado
    const handleSelectAsegurado = async (asegurado: Asegurado) => {
        setSelectedAsegurado(asegurado);
        await loadUbicaciones(asegurado.id);
        setShowUbicacionForm(false);
    };

    // Reset asegurado form
    const resetAseguradoForm = () => {
        setAseguradoFormData({
            razon_social: '',
            identificacion: '',
            nombre: '',
            direccion: '',
            telefono: '',
            correo: '',
        });
        setEditingAsegurado(null);
        setShowAseguradoForm(false);
        setAseguradoFormError('');
    };

    // Editar asegurado
    const handleEditAsegurado = (asegurado: Asegurado) => {
        setEditingAsegurado(asegurado);
        setAseguradoFormData({
            razon_social: asegurado.razon_social,
            identificacion: asegurado.identificacion,
            nombre: asegurado.nombre,
            direccion: asegurado.direccion || '',
            telefono: asegurado.telefono || '',
            correo: asegurado.correo || '',
        });
        setShowAseguradoForm(true);
    };

    // Submit asegurado
    const handleSubmit Asegurado = async (e: React.FormEvent) => {
        e.preventDefault();
        setAseguradoFormError('');
        setIsSubmittingAsegurado(true);

        try {
            if (editingAsegurado) {
                const updated = await api.updateAsegurado(editingAsegurado.id, aseguradoFormData);
                if (selectedAsegurado?.id === editingAsegurado.id) {
                    setSelectedAsegurado(updated);
                }
            } else {
                await api.createAsegurado(aseguradoFormData);
            }
            resetAseguradoForm();
            await loadAsegurados();
        } catch (err) {
            setAseguradoFormError(err instanceof Error ? err.message : 'Error al guardar asegurado');
        } finally {
            setIsSubmittingAsegurado(false);
        }
    };

    // Eliminar asegurado
    const handleDeleteAsegurado = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este asegurado? Se eliminarán también todas sus ubicaciones')) {
            return;
        }

        try {
            await api.deleteAsegurado(id);
            if (selectedAsegurado?.id === id) {
                setSelectedAsegurado(null);
                setUbicaciones([]);
            }
            await loadAsegurados();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al eliminar asegurado');
        }
    };

    // Crear ubicación
    const handleCreateUbicacion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAsegurado) return;

        setUbicacionFormError('');
        setIsSubmittingUbicacion(true);

        try {
            await api.createUbicacion(selectedAsegurado.id, ubicacionFormData);
            setUbicacionFormData({ ciudad: '', pais: '' });
            setShowUbicacionForm(false);
            setModoUbicacion('select');
            await loadUbicaciones(selectedAsegurado.id);
            await loadTodasUbicaciones();
        } catch (err) {
            setUbicacionFormError(err instanceof Error ? err.message : 'Error al crear ubicación');
        } finally {
            setIsSubmittingUbicacion(false);
        }
    };

    // Seleccionar ubicación existente
    const handleSelectExistingUbicacion = async (ubicacion: Ubicacion) => {
        if (!selectedAsegurado) return;

        setIsSubmittingUbicacion(true);
        try {
            await api.createUbicacion(selectedAsegurado.id, {
                ciudad: ubicacion.ciudad,
                pais: ubicacion.pais,
            });
            setShowUbicacionForm(false);
            await loadUbicaciones(selectedAsegurado.id);
        } catch (err) {
            setUbicacionFormError(err instanceof Error ? err.message : 'Error al agregar ubicación');
        } finally {
            setIsSubmittingUbicacion(false);
        }
    };

    // Eliminar ubicación
    const handleDeleteUbicacion = async (ubicacionId: number) => {
        if (!selectedAsegurado) return;
        if (!confirm('¿Estás seguro de eliminar esta ubicación?')) return;

        try {
            await api.deleteUbicacion(selectedAsegurado.id, ubicacionId);
            await loadUbic aciones(selectedAsegurado.id);
            await loadTodasUbicaciones();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al eliminar ubicación');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                        Gestión de Asegurados
                    </h1>
                    <p className="mt-2 text-zinc-600">
                        Administra asegurados y sus ubicaciones
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Sección de Asegurados */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-zinc-800">Asegurados</h2>
                            <button
                                onClick={() => {
                                    if (showAseguradoForm) {
                                        resetAseguradoForm();
                                    } else {
                                        setShowAseguradoForm(true);
                                    }
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02] hover:shadow-purple-500/60"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAseguradoForm ? "M6 18L18 6M6 6112 12" : "M12 6v6m0  0v6m0-6h6m-6 0H6"} />
                                </svg>
                                {showAseguradoForm ? 'Cancelar' : 'Nuevo Asegurado'}
                            </button>
                        </div>

                        {/* Buscador */}
                        <div className="mb-4 rounded-2xl bg-white p-4 shadow-xl shadow-zinc-200/50">
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Buscar por Identificación
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ejнгать123456789"
                                    className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchQuery && (
                                <p className="mt-2 text-sm text-zinc-600">
                                    {searchResults.length} resultado(s) encontrado(s)
                                </p>
                            )}
                        </div>

                        {/* Formulario de as_crear/editar asegurado */}
                        {showAseguradoForm && (
                            <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl shadow-zinc-200/50">
                                <h3 className="mb-4 text-lg font-semibold text-zinc-800">
                                    {editingAsegurado ? 'Editar Asegurado' : 'Nuevo Asegurado'}
                                </h3>

                                {aseguradoForm Error && (
                                <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                                    {aseguradoFormError}
                                </div>
                                )}

                                <form onSubmit={handleSubmitAsegurado} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700">
                                            Razón Social *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={aseguradoFormData.razon_social}
                                            onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, razon_social: e.target.value })}
                                            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">
                                                Identificación *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={aseguradoFormData.identificacion}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, identificacion: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">
                                                Nombre *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={aseguradoFormData.nombre}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, nombre: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            value={aseguradoFormData.direccion}
                                            onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, direccion: e.target.value })}
                                            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={aseguradoFormData.telefono}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, telefono: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">
                                                Correo
                                            </label>
                                            <input
                                                type="email"
                                                value={aseguradoFormData.correo}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, correo: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit  "
                                        disabled={isSubmittingAsegurado}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02] hover:shadow-purple-500/60 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmittingAsegurado ? (
                                            <>
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                {editingAsegurado ? 'Guardando...' : 'Creando...'}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {editingAsegurado ? 'Guardar Cambios' : 'Crear Asegurado'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Resultados de búsqueda */}
                        {searchQuery && (
                            <div className="rounded-2xl bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
                                <div className="border-b border-zinc-200 px-4 py-3">
                                    <h4 className="font-semibold text-zinc-800">
                                        Resultados de B{searchResults.length}búsqueda ({searchResults.length})
                                    </h4>
                                </div>

                                {searchResults.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-500">
                                        No se encontraron asegurados con esa identificación
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-200">
                                        {searchResults.map((asegurado) => (
                                            <div
                                                key={asegurado.id}
                                                className={`p-4 transition-colors ${selectedAsegurado?.id === asegurado.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-zinc-50'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div
                                                        className="flex-1 cursor-pointer"
                                                        onClick={() => handleSelectAsegurado(asegurado)}
                                                    >
                                                        <h4 className="font-semibold text-zinc-900">{asegurado.razon_social}</h4>
                                                        <p className="text-sm text-zinc-600">ID: {asegurado.identificacion}</p>
                                                        <p className="text-sm text-zinc-600">{asegurado.nombre}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditAsegurado(asegurado)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Editar"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAsegurado(asegurado.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Eliminar"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sección de Detalles y Ubicaciones */}
                    <div>
                        {/* ... resto del código de ubicaciones que permanece igual ... */}
                    </div>
                </div>
            </div>
        </div>
    );
}
