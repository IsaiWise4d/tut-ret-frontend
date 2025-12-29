'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/hooks/useAuth';
import { Slip, SlipHistory } from '@/app/types/slips';
import { getSlips, deleteSlip, generateSlipPdf, getSlipHistory, searchSlips } from '@/app/lib/api';
import SlipForm from '@/app/components/forms/SlipForm';
import SlipHistoryModal from '@/app/components/SlipHistoryModal';

export default function SlipsPage() {
    return (
        <ProtectedRoute>
            <SlipsContent />
        </ProtectedRoute>
    );
}

function SlipsContent() {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [slips, setSlips] = useState<Slip[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSlip, setEditingSlip] = useState<Slip | undefined>(undefined);
    const [vigenciaFilter, setVigenciaFilter] = useState<'all' | 'vigente' | 'expirado'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // History Modal State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState<SlipHistory[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const loadSlips = async (query: string = '') => {
        setLoading(true);
        try {
            let data;
            if (query.trim()) {
                data = await searchSlips(query);
            } else {
                data = await getSlips();
            }
            setSlips(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (viewMode === 'list') {
                loadSlips(searchQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [viewMode, searchQuery]);

    const toggleVigenciaFilter = () => {
        setVigenciaFilter(prev => {
            if (prev === 'all') return 'vigente';
            if (prev === 'vigente') return 'expirado';
            return 'all';
        });
    };

    const filteredSlips = slips.filter(slip => {
        if (vigenciaFilter === 'all') return true;
        
        const isVigente = new Date(slip.vigencia_fin + 'T00:00:00') >= new Date(new Date().setHours(0, 0, 0, 0));
        
        if (vigenciaFilter === 'vigente') return isVigente;
        if (vigenciaFilter === 'expirado') return !isVigente;
        return true;
    });

    const handleCreate = () => {
        setEditingSlip(undefined);
        setViewMode('form');
    };

    const handleEdit = (slip: Slip) => {
        setEditingSlip(slip);
        setViewMode('form');
    };

    const handleHistory = async (slipId: number) => {
        setHistoryOpen(true);
        setHistoryLoading(true);
        try {
            const data = await getSlipHistory(slipId);
            setHistoryData(data);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este Slip? Esta acción no se puede deshacer.')) return;
        try {
            await deleteSlip(id);
            loadSlips();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleGeneratePdf = async (slip: Slip) => {
        try {
            const blob = await generateSlipPdf(slip.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `slip-${slip.id}-${slip.numero_slip}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleFormSuccess = () => {
        setViewMode('list');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className={viewMode === 'form' ? 'mx-auto w-full' : 'mx-auto max-w-7xl'}>
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                            Gestión de Slips
                        </h1>
                        <p className="mt-2 text-zinc-600">Administra tus contratos de reaseguro.</p>
                    </div>
                    {viewMode === 'list' && (
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Slip
                        </button>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 overflow-hidden">
                        <div className="p-4 border-b border-zinc-100">
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-lg leading-5 bg-white placeholder-zinc-500 focus:outline-none focus:placeholder-zinc-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                    placeholder="Buscar por número de slip o asegurado..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                            </div>
                        ) : slips.length === 0 ? (
                            <div className="p-12 text-center text-zinc-500">
                                No hay slips registrados.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-zinc-200">
                                    <thead className="bg-zinc-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Número</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Asegurado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Tipo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Estado</th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 cursor-pointer hover:bg-zinc-100 transition-colors select-none"
                                                onClick={toggleVigenciaFilter}
                                                title="Click para filtrar: Todos -> Vigentes -> Expirados"
                                            >
                                                <div className="flex items-center gap-1">
                                                    Vigencia
                                                    {vigenciaFilter !== 'all' && (
                                                        <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
                                                            vigenciaFilter === 'vigente' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {vigenciaFilter === 'vigente' ? 'Vigentes' : 'Expirados'}
                                                        </span>
                                                    )}
                                                    {vigenciaFilter === 'all' && (
                                                        <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 bg-white">
                                        {filteredSlips.map((slip) => (
                                            <tr key={slip.id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                                                    {slip.numero_slip}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                                    {slip.nombre_asegurado}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                                                        {slip.tipo_slip}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${slip.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                                                            slip.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {slip.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                                    <div className="flex flex-col gap-1">
                                                        <span>{slip.vigencia_inicio} / {slip.vigencia_fin}</span>
                                                        {(() => {
                                                            const isVigente = new Date(slip.vigencia_fin + 'T00:00:00') >= new Date(new Date().setHours(0, 0, 0, 0));
                                                            return (
                                                                <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${isVigente
                                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                                    }`}>
                                                                    {isVigente ? 'Vigente' : 'Expirado'}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleHistory(slip.id)}
                                                        className="text-gray-500 hover:text-gray-700 mr-4 font-semibold"
                                                    >
                                                        Historial
                                                    </button>
                                                    <button
                                                        onClick={() => handleGeneratePdf(slip)}
                                                        className="text-purple-600 hover:text-purple-900 mr-4 font-semibold"
                                                        title="Generar PDF"
                                                    >
                                                        PDF
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(slip)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4 font-semibold"
                                                    >
                                                        Editar
                                                    </button>
                                                    {user?.role === 'SUPER_ADMIN' && (
                                                        <button
                                                            onClick={() => handleDelete(slip.id)}
                                                            className="text-red-600 hover:text-red-900 font-semibold"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full">
                        <SlipForm
                            initialData={editingSlip}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setViewMode('list')}
                        />
                    </div>
                )}
            </div>

            <SlipHistoryModal
                isOpen={historyOpen}
                onClose={() => setHistoryOpen(false)}
                history={historyData}
                isLoading={historyLoading}
            />
        </div>
    );
}
