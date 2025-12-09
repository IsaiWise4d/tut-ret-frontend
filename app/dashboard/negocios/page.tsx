'use client';

import { useState, useEffect } from 'react';
import { Negocio, NegocioHistory } from '@/app/types/negocios';
import { getNegocios, getNegocioHistory, getAsegurado, getUbicaciones } from '@/app/lib/api';
import NegocioForm from '@/app/components/forms/NegocioForm';
import NegocioHistoryModal from '@/app/components/NegocioHistoryModal';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function NegociosPage() {
    return (
        <ProtectedRoute>
            <NegociosContent />
        </ProtectedRoute>
    );
}

// Helper to display names instead of IDs
interface EnrichedNegocio extends Negocio {
    aseguradoNombre?: string;
    ubicacionNombre?: string;
}

function NegociosContent() {
    const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

    // Data States
    const [negocios, setNegocios] = useState<EnrichedNegocio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit State (Overrides Create Tab)
    const [editingNegocio, setEditingNegocio] = useState<Negocio | undefined>(undefined);

    // History State
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState<NegocioHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Fetch and enrich data
    const fetchNegocios = async () => {
        setLoading(true);
        try {
            const data = await getNegocios();

            // Enrich with names
            const enriched: EnrichedNegocio[] = await Promise.all(data.map(async (n) => {
                try {
                    // Fetch Asegurado Name
                    const asegurado = await getAsegurado(n.asegurado_id);
                    // Fetch Ubicacion Name
                    const ubicaciones = await getUbicaciones(n.asegurado_id);
                    const ubicacion = ubicaciones.find(u => u.id === n.ubicacion_id);

                    return {
                        ...n,
                        aseguradoNombre: asegurado.razon_social,
                        ubicacionNombre: ubicacion ? `${ubicacion.ciudad} - ${ubicacion.direccion}` : 'Ubicación Desconocida'
                    };
                } catch {
                    return { ...n, aseguradoNombre: 'Desconocido', ubicacionNombre: 'Desconocido' };
                }
            }));

            setNegocios(enriched);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar negocios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'list') {
            fetchNegocios();
        }
    }, [activeTab]);

    const handleCreateSuccess = () => {
        setActiveTab('list');
        setEditingNegocio(undefined);
    };

    const handleEdit = (negocio: Negocio) => {
        // Switch to create tab but in edit mode
        setEditingNegocio(negocio);
        setActiveTab('create');
    };

    const handleTabChange = (tab: 'list' | 'create') => {
        setActiveTab(tab);
        if (tab === 'list') {
            setEditingNegocio(undefined); // Clear edit state when going back to list manually
        } else {
            setEditingNegocio(undefined); // Ensure we start fresh create if clicking tab directly
        }
    };

    const handleViewHistory = async (id: number) => {
        setIsHistoryOpen(true);
        setLoadingHistory(true);
        try {
            const data = await getNegocioHistory(id);
            setHistoryData(data);
        } catch (err) {
            console.error(err);
            setHistoryData([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                            Caracterización del Negocio
                        </h1>
                        <p className="mt-2 text-zinc-600">Gestiona tus negocios, clientes y coberturas.</p>
                    </div>
                    <div className="flex rounded-lg bg-zinc-100 p-1 shadow-inner">
                        <button
                            onClick={() => handleTabChange('list')}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === 'list'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            Listado de Negocios
                        </button>
                        <button
                            onClick={() => handleTabChange('create')}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === 'create'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            {editingNegocio ? 'Editar Negocio' : 'Crear Nuevo Negocio'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'list' ? (
                    <div>
                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="rounded-2xl bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-zinc-200">
                                    <thead className="bg-zinc-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Código</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Cliente (Razón Social)</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Ubicación</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Corredor</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Compañía</th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Acciones</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 bg-white">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                                                    <div className="flex justify-center">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : negocios.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                                                    No hay negocios registrados. Seleccione &quot;Crear Nuevo Negocio&quot; para comenzar.
                                                </td>
                                            </tr>
                                        ) : (
                                            negocios.map((negocio) => (
                                                <tr key={negocio.id} className="transition-colors hover:bg-zinc-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900">
                                                        {negocio.codigo}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                                        {negocio.aseguradoNombre || `ID: ${negocio.asegurado_id}`}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                                        {negocio.ubicacionNombre || `ID: ${negocio.ubicacion_id}`}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                                        {negocio.corredor}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                                        {negocio.compania}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEdit(negocio)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4 font-semibold"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewHistory(negocio.id)}
                                                            className="text-zinc-500 hover:text-zinc-700 font-medium"
                                                        >
                                                            Historial
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <NegocioForm
                            initialData={editingNegocio}
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setActiveTab('list')}
                        />
                    </div>
                )}
            </div>

            <NegocioHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={historyData}
                isLoading={loadingHistory}
            />
        </div>
    );
}
