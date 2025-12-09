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

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Fetch and enrich data
    const enrichNegocios = async (data: Negocio[]) => {
        return Promise.all(data.map(async (n) => {
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
    };

    const fetchNegocios = async () => {
        setLoading(true);
        try {
            const data = await getNegocios();
            const enriched = await enrichNegocios(data);
            setNegocios(enriched);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar negocios');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        setIsSearching(true);

        // Debounce or immediate if empty logic can go here, but for now we search on effect or direct call
        // Let's implement active searching:
        try {
            let data: Negocio[];
            if (!query.trim()) {
                data = await getNegocios();
            } else {
                // Import this dynamically or ensure it is imported at top
                const { searchNegocios } = await import('@/app/lib/api');
                data = await searchNegocios(query);
            }

            const enriched = await enrichNegocios(data);
            setNegocios(enriched);
        } catch (err) {
            console.error(err);
            // If search fails, maybe just show empty or previous?
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce effect for search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Initial load
    useEffect(() => {
        // Only fetch initially if not searching (though search effect will trigger with empty string too)
        // fetchNegocios(); 
        // We let the headers effect below handle initial fetch if we want, OR just rely on search effect with empty string
    }, []);

    // However, handling tab change might need refetch?
    useEffect(() => {
        if (activeTab === 'list') {
            // Reset search? Or keep it? Let's keep it if user typed something
            handleSearch(searchQuery);
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

                        <div className="mb-6 flex gap-4">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Buscar por código o cliente..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border-zinc-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                {isSearching && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                        </div>

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
