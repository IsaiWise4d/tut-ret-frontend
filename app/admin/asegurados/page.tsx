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
    // View Mode: 'list' | 'form'
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

    const [asegurados, setAsegurados] = useState<Asegurado[]>([]);
    const [selectedAsegurado, setSelectedAsegurado] = useState<Asegurado | null>(null);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [todasUbicaciones, setTodasUbicaciones] = useState<Ubicacion[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    // Estados de búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Asegurado[]>([]);

    // Estados para formulario de asegurado
    const [editingAsegurado, setEditingAsegurado] = useState<Asegurado | null>(null);
    const [aseguradoFormData, setAseguradoFormData] = useState<CreateAseguradoData>({
        razon_social: '',
        identificacion: '',
        nombre: '',
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
        direccion: '',
        telefono: '',
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
            setSearchResults(asegurados);
            return;
        }

        const results = asegurados.filter(aseg =>
            aseg.identificacion.toLowerCase().includes(searchQuery.toLowerCase()) ||
            aseg.razon_social.toLowerCase().includes(searchQuery.toLowerCase()) ||
            aseg.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
    }, [searchQuery, asegurados]);

    const resetAseguradoForm = () => {
        setAseguradoFormData({
            razon_social: '',
            identificacion: '',
            nombre: '',
            correo: '',
        });
        setEditingAsegurado(null);
        setSelectedAsegurado(null);
        setAseguradoFormError('');
        setUbicaciones([]);
    };

    const handleSwitchToCreate = () => {
        resetAseguradoForm();
        setViewMode('form');
    };

    const handleSwitchToList = () => {
        setViewMode('list');
        resetAseguradoForm();
    };

    const handleEditAsegurado = async (asegurado: Asegurado) => {
        setEditingAsegurado(asegurado);
        setSelectedAsegurado(asegurado);
        setAseguradoFormData({
            razon_social: asegurado.razon_social,
            identificacion: asegurado.identificacion,
            nombre: asegurado.nombre,
            correo: asegurado.correo || '',
        });
        await loadUbicaciones(asegurado.id);
        setViewMode('form');
    };

    const handleSubmitAsegurado = async (e: React.FormEvent) => {
        e.preventDefault();
        setAseguradoFormError('');
        setIsSubmittingAsegurado(true);

        try {
            if (editingAsegurado) {
                const updated = await api.updateAsegurado(editingAsegurado.id, aseguradoFormData);
                setSelectedAsegurado(updated);
                setEditingAsegurado(updated);
                alert('Asegurado actualizado correctamente');
            } else {
                const newAsegurado = await api.createAsegurado(aseguradoFormData);
                setSelectedAsegurado(newAsegurado);
                setEditingAsegurado(newAsegurado); // Switch to edit mode after creation
                await loadUbicaciones(newAsegurado.id);
                alert('Asegurado creado correctamente. Ahora puedes agregar ubicaciones.');
            }
            await loadAsegurados();
        } catch (err) {
            setAseguradoFormError(err instanceof Error ? err.message : 'Error al guardar asegurado');
        } finally {
            setIsSubmittingAsegurado(false);
        }
    };

    const handleCreateUbicacion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAsegurado) return;

        setUbicacionFormError('');
        setIsSubmittingUbicacion(true);

        try {
            await api.createUbicacion(selectedAsegurado.id, ubicacionFormData);
            setUbicacionFormData({ ciudad: '', pais: '', direccion: '', telefono: '' });
            setShowUbicacionForm(false);
            setModoUbicacion('select');
            await loadUbicaciones(selectedAsegurado.id);
            await loadTodasUbicaciones();
            await loadAsegurados();
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
            setUbicacionFormData({
                ciudad: ubicacion.ciudad,
                pais: ubicacion.pais,
                direccion: '',
                telefono: ''
            });
            setModoUbicacion('manual');
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
            await loadAsegurados();
        } catch (err) {
            alert('Error al eliminar ubicación');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                            Gestión de Asegurados
                        </h1>
                        <p className="mt-2 text-zinc-600">Administra asegurados y sus ubicaciones</p>
                    </div>
                    <div className="flex rounded-lg bg-zinc-100 p-1 shadow-inner">
                        <button
                            onClick={handleSwitchToList}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${viewMode === 'list'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            Ver Asegurados
                        </button>
                        <button
                            onClick={handleSwitchToCreate}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${viewMode === 'form'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            Crear Asegurado
                        </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    /* VISTA DE LISTA */
                    <div className="space-y-6">
                        {/* Buscador */}
                        <div className="rounded-2xl bg-white p-4 shadow-xl shadow-zinc-200/50">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre, identificación o razón social..."
                                    className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="rounded-2xl bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
                            {isLoading ? (
                                <div className="flex justify-center p-12">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-12 text-center text-zinc-500">
                                    No se encontraron asegurados
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-zinc-200">
                                        <thead className="bg-zinc-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Razón Social</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Identificación</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Correo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Ubicaciones</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 bg-white">
                                            {searchResults.map((asegurado) => (
                                                <tr key={asegurado.id} className="transition-colors hover:bg-zinc-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900">{asegurado.razon_social}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">{asegurado.identificacion}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">{asegurado.nombre}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">{asegurado.correo || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-zinc-500">
                                                        {asegurado.ubicaciones && asegurado.ubicaciones.length > 0 ? (
                                                            <div className="flex flex-col gap-1">
                                                                {asegurado.ubicaciones.map((ubi, idx) => (
                                                                    <span key={idx} className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                                                                        {ubi.ciudad}, {ubi.pais}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-zinc-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                        <button
                                                            onClick={() => handleEditAsegurado(asegurado)}
                                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                                        >
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* VISTA DE FORMULARIO */
                    <div className="mx-auto max-w-3xl space-y-8">
                        {/* Formulario Asegurado */}
                        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50">
                            <h2 className="mb-6 text-2xl font-semibold text-zinc-800">
                                {editingAsegurado ? 'Editar Asegurado' : 'Nuevo Asegurado'}
                            </h2>
                            {aseguradoFormError && (
                                <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                                    {aseguradoFormError}
                                </div>
                            )}
                            <form onSubmit={handleSubmitAsegurado} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700">Razón Social *</label>
                                    <input type="text" required value={aseguradoFormData.razon_social}
                                        onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, razon_social: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
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
                                    <label className="block text-sm font-medium text-zinc-700">Correo</label>
                                    <input type="email" value={aseguradoFormData.correo}
                                        onChange={(e) => setAseguradoFormData({ ...aseguradoFormData, correo: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleSwitchToList}
                                        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingAsegurado}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                                    >
                                        {isSubmittingAsegurado ? 'Guardando...' : (editingAsegurado ? 'Actualizar Asegurado' : 'Crear Asegurado')}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Gestión de Ubicaciones (Solo visible si hay un asegurado seleccionado/creado) */}
                        {selectedAsegurado && (
                            <div className="rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-zinc-800">Ubicaciones</h3>
                                    <button onClick={() => { setShowUbicacionForm(!showUbicacionForm); setModoUbicacion('select'); }}
                                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showUbicacionForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                                        </svg>
                                        {showUbicacionForm ? 'Cancelar' : 'Agregar Ubicación'}
                                    </button>
                                </div>

                                {showUbicacionForm && (
                                    <div className="mb-8 rounded-xl bg-zinc-50 p-6 border border-zinc-200">
                                        {ubicacionFormError && <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">{ubicacionFormError}</div>}
                                        <div className="mb-4 flex gap-2">
                                            <button type="button" onClick={() => setModoUbicacion('select')}
                                                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${modoUbicacion === 'select' ? 'bg-white text-green-700 shadow-sm ring-1 ring-green-200' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                                Seleccionar Existente
                                            </button>
                                            <button type="button" onClick={() => setModoUbicacion('manual')}
                                                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${modoUbicacion === 'manual' ? 'bg-white text-green-700 shadow-sm ring-1 ring-green-200' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                                Crear Nueva
                                            </button>
                                        </div>

                                        {modoUbicacion === 'select' ? (
                                            <div className="max-h-60 overflow-y-auto space-y-2">
                                                {todasUbicaciones.length === 0 ? (
                                                    <p className="text-center py-8 text-zinc-500 text-sm">No hay ubicaciones previas. Crea una nueva.</p>
                                                ) : (
                                                    todasUbicaciones.map((ubicacion, idx) => (
                                                        <button key={idx} type="button" onClick={() => handleSelectExistingUbicacion(ubicacion)} disabled={isSubmittingUbicacion}
                                                            className="w-full text-left p-3 rounded-lg bg-white border border-zinc-200 hover:border-green-500 hover:bg-green-50 transition-all">
                                                            <p className="font-medium text-zinc-900">{ubicacion.ciudad}</p>
                                                            <p className="text-sm text-zinc-600">{ubicacion.pais}</p>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        ) : (
                                            <form onSubmit={handleCreateUbicacion} className="space-y-4">
                                                <div className="grid gap-4 sm:grid-cols-2">
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
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-zinc-700">Dirección *</label>
                                                        <input type="text" required value={ubicacionFormData.direccion}
                                                            onChange={(e) => setUbicacionFormData({ ...ubicacionFormData, direccion: e.target.value })}
                                                            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-zinc-700">Teléfono *</label>
                                                        <input type="tel" required value={ubicacionFormData.telefono}
                                                            onChange={(e) => setUbicacionFormData({ ...ubicacionFormData, telefono: e.target.value })}
                                                            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={isSubmittingUbicacion}
                                                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-700 disabled:opacity-50">
                                                    {isSubmittingUbicacion ? 'Creando...' : 'Guardar Ubicación'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}

                                <div className="overflow-hidden rounded-xl border border-zinc-200">
                                    <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200">
                                        <h4 className="font-medium text-zinc-700">Ubicaciones Asignadas</h4>
                                    </div>
                                    {ubicaciones.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-500">Este asegurado no tiene ubicaciones asignadas</div>
                                    ) : (
                                        <div className="divide-y divide-zinc-200">
                                            {ubicaciones.map((ubi) => (
                                                <div key={ubi.id} className="flex items-center justify-between p-4 hover:bg-zinc-50">
                                                    <div>
                                                        <p className="font-medium text-zinc-900">{ubi.ciudad}</p>
                                                        <p className="text-sm text-zinc-600">{ubi.pais}</p>
                                                        <p className="text-sm text-zinc-500">{ubi.direccion} - {ubi.telefono}</p>
                                                    </div>
                                                    <button onClick={() => handleDeleteUbicacion(ubi.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors">
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
