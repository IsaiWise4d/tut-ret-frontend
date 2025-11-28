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
    const [selectedAsegurado, setSelectedAsegurado] = useState<Asegurado | null>(null);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [todasUbicaciones, setTodasUbicaciones] = useState<Ubicacion[]>([]);

    const [isLoading, setIsLoading] = useState(true);

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
        } catch (err) {
            console.error('Error al cargar asegurados:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar ubicaciones
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
            console.error('Error al cargar ubicaciones:', err);
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

    // Buscar asegurados
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

    const handleSelectAsegurado = async (asegurado: Asegurado) => {
        setSelectedAsegurado(asegurado);
        await loadUbicaciones(asegurado.id);
        setShowUbicacionForm(false);
    };

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

    const handleSubmitAsegurado = async (e: React.FormEvent) => {
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
                const newAsegurado = await api.createAsegurado(aseguradoFormData);
                // Seleccionar automáticamente el asegurado recién creado
                setSelectedAsegurado(newAsegurado);
                await loadUbicaciones(newAsegurado.id);
            }
            resetAseguradoForm();
            await loadAsegurados();
        } catch (err) {
            setAseguradoFormError(err instanceof Error ? err.message : 'Error al guardar asegurado');
        } finally {
            setIsSubmittingAsegurado(false);
        }
    };

    const handleDeleteAsegurado = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este asegurado?')) return;

        try {
            await api.deleteAsegurado(id);
            if (selectedAsegurado?.id === id) {
                setSelectedAsegurado(null);
                setUbicaciones([]);
            }
            await loadAsegurados();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al eliminar');
        }
    };

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
            setUbicacionFormError(err instanceof Error ? err.message : 'Error');
        } finally {
            setIsSubmittingUbicacion(false);
        }
    };

    const handleDeleteUbicacion = async (ubicacionId: number) => {
        if (!selectedAsegurado || !confirm('¿Eliminar ubicación?')) return;

        try {
            await api.deleteUbicacion(selectedAsegurado.id, ubicacionId);
            await loadUbicaciones(selectedAsegurado.id);
            await loadTodasUbicaciones();
        } catch (err) {
            alert('Error al eliminar ubicación');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                        Gestión de Asegurados
                    </h1>
                    <p className="mt-2 text-zinc-600">Administra asegurados y sus ubicaciones</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Sección Asegurados */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-zinc-800">Asegurados</h2>
                            <button
                                onClick={() => showAseguradoForm ? resetAseguradoForm() : setShowAseguradoForm(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02]"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAseguradoForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                                </svg>
                                {showAseguradoForm ? 'Cancelar' : 'Nuevo Asegurado'}
                            </button>
                        </div>

                        {/* Formulario */}
                        {showAseguradoForm && (
                            <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
                                <h3 className="mb-4 text-lg font-semibold text-zinc-800">
                                    {editingAsegurado ? 'Editar' : 'Nuevo'} Asegurado
                                </h3>
                                {aseguradoFormError && (
                                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                                        {aseguradoFormError}
                                    </div>
                                )}
                                <form onSubmit={handleSubmitAsegurado} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700">Razón Social *</label>
                                        <input type="text" required value={aseguradoFormData.razon_social}
                                            onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, razon_social: e.target.value })}
                                            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">Identificación *</label>
                                            <input type="text" required value={aseguradoFormData.identificacion}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, identificacion: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">Nombre *</label>
                                            <input type="text" required value={aseguradoFormData.nombre}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, nombre: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700">Dirección</label>
                                        <input type="text" value={aseguradoFormData.direccion}
                                            onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, direccion: e.target.value })}
                                            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">Teléfono</label>
                                            <input type="tel" value={aseguradoFormData.telefono}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, telefono: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700">Correo</label>
                                            <input type="email" value={aseguradoFormData.correo}
                                                onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, correo: e.target.value })}
                                                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isSubmittingAsegurado}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50">
                                        {isSubmittingAsegurado ? 'Guardando...' : (editingAsegurado ? 'Guardar' : 'Crear')}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Buscador */}
                        <div className="mb-4 rounded-2xl bg-white p-4 shadow-xl">
                            <label className="block text-sm font-medium text-zinc-700 mb-2">Buscar por Identificación</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ej: 123456789"
                                    className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchQuery && <p className="mt-2 text-sm text-zinc-600">{searchResults.length} resultado(s)</p>}
                        </div>

                        {/* Resultados de búsqueda */}
                        {searchQuery ? (
                            <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
                                {searchResults.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-500">No se encontraron resultados</div>
                                ) : (
                                    <div className="divide-y divide-zinc-200">
                                        {searchResults.map((asegurado) => (
                                            <div key={asegurado.id} className={`p-4 ${selectedAsegurado?.id === asegurado.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-zinc-50'}`}>
                                                <div className="flex justify-between">
                                                    <div className="flex-1 cursor-pointer" onClick={() => handleSelectAsegurado(asegurado)}>
                                                        <h4 className="font-semibold text-zinc-900">{asegurado.razon_social}</h4>
                                                        <p className="text-sm text-zinc-600">ID: {asegurado.identificacion}</p>
                                                        <p className="text-sm text-zinc-600">{asegurado.nombre}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditAsegurado(asegurado)} className="text-blue-600 hover:text-blue-900">
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => handleDeleteAsegurado(asegurado.id)} className="text-red-600 hover:text-red-900">
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
                        ) : (
                            <div className="rounded-2xl bg-white p-8 shadow-xl text-center text-zinc-500">
                                Usa el buscador para encontrar asegurados
                            </div>
                        )}
                    </div>

                    {/* Sección Ubicaciones */}
                    <div>
                        {!selectedAsegurado ? (
                            <div className="rounded-2xl bg-white p-12 shadow-xl text-center">
                                <svg className="mx-auto h-16 w-16 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="mt-4 text-zinc-500">Selecciona un asegurado</p>
                            </div>
                        ) : (
                            <>
                                {/* Detalles */}
                                <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
                                    <h3 className="mb-4 text-lg font-semibold">Información del Asegurado</h3>
                                    <div className="space-y-3">
                                        <div><p className="text-sm text-zinc-500">Razón Social</p><p className="font-medium">{selectedAsegurado.razon_social}</p></div>
                                        <div><p className="text-sm text-zinc-500">Identificación</p><p className="font-medium">{selectedAsegurado.identificacion}</p></div>
                                        <div><p className="text-sm text-zinc-500">Nombre</p><p className="font-medium">{selectedAsegurado.nombre}</p></div>
                                        {selectedAsegurado.direccion && <div><p className="text-sm text-zinc-500">Dirección</p><p className="font-medium">{selectedAsegurado.direccion}</p></div>}
                                        {selectedAsegurado.telefono && <div><p className="text-sm text-zinc-500">Teléfono</p><p className="font-medium">{selectedAsegurado.telefono}</p></div>}
                                        {selectedAsegurado.correo && <div><p className="text-sm text-zinc-500">Correo</p><p className="font-medium">{selectedAsegurado.correo}</p></div>}
                                    </div>
                                </div>

                                {/* Ubicaciones */}
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">Ubicaciones</h3>
                                    <button onClick={() => { setShowUbicacionForm(!showUbicacionForm); setModoUbicacion('select'); }}
                                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showUbicacionForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                                        </svg>
                                        {showUbicacionForm ? 'Cancelar' : 'Nueva'}
                                    </button>
                                </div>

                                {showUbicacionForm && (
                                    <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
                                        {ubicacionFormError && <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">{ubicacionFormError}</div>}
                                        <div className="mb-4 flex gap-2">
                                            <button type="button" onClick={() => setModoUbicacion('select')}
                                                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${modoUbicacion === 'select' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                                                Seleccionar
                                            </button>
                                            <button type="button" onClick={() => setModoUbicacion('manual')}
                                                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${modoUbicacion === 'manual' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                                                Nueva
                                            </button>
                                        </div>

                                        {modoUbicacion === 'select' ? (
                                            <div className="max-h-60 overflow-y-auto space-y-2">
                                                {todasUbicaciones.length === 0 ? (
                                                    <p className="text-center py-8 text-zinc-500 text-sm">No hay ubicaciones. Crea una nueva.</p>
                                                ) : (
                                                    todasUbicaciones.map((ubicacion, idx) => (
                                                        <button key={idx} type="button" onClick={() => handleSelectExistingUbicacion(ubicacion)} disabled={isSubmittingUbicacion}
                                                            className="w-full text-left p-3 rounded-lg border border-zinc-200 hover:border-green-500 hover:bg-green-50">
                                                            <p className="font-medium">{ubicacion.ciudad}</p>
                                                            <p className="text-sm text-zinc-600">{ubicacion.pais}</p>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        ) : (
                                            <form onSubmit={handleCreateUbicacion} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700">Ciudad *</label>
                                                    <input type="text" required value={ubicacionFormData.ciudad}
                                                        onChange={(e) => setUbicacionFormData({ ...ubicacionFormData, ciudad: e.target.value })}
                                                        className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700">País *</label>
                                                    <input type="text" required value={ubicacionFormData.pais}
                                                        onChange={(e) => setUbicacionFormData({ ...ubicacionFormData, pais: e.target.value })}
                                                        className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                </div>
                                                <button type="submit" disabled={isSubmittingUbicacion}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50">
                                                    {isSubmittingUbicacion ? 'Creando...' : 'Crear'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}

                                <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
                                    <div className="border-b border-zinc-200 px-4 py-3">
                                        <h4 className="font-semibold">Ubicaciones Asignadas</h4>
                                    </div>
                                    {ubicaciones.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-500">Sin ubicaciones</div>
                                    ) : (
                                        <div className="divide-y divide-zinc-200">
                                            {ubicaciones.map((ubi) => (
                                                <div key={ubi.id} className="p-4 flex justify-between">
                                                    <div>
                                                        <p className="font-medium">{ubi.ciudad}</p>
                                                        <p className="text-sm text-zinc-600">{ubi.pais}</p>
                                                    </div>
                                                    <button onClick={() => handleDeleteUbicacion(ubi.id)} className="text-red-600 hover:text-red-900">
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
