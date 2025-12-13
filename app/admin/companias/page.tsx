'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import * as api from '@/app/lib/api';
import { CompaniaSeguros } from '@/app/types/negocios';
import CompaniaForm from '@/app/components/forms/CompaniaForm';

export default function CompaniasPage() {
    return (
        <ProtectedRoute>
            <CompaniasContent />
        </ProtectedRoute>
    );
}

function CompaniasContent() {
    const [companias, setCompanias] = useState<CompaniaSeguros[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCompania, setEditingCompania] = useState<CompaniaSeguros | undefined>(undefined);

    const loadCompanias = async () => {
        try {
            setIsLoading(true);
            const data = await api.getCompaniasSeguros();
            setCompanias(data);
        } catch (err) {
            console.error('Error al cargar compañias:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCompanias();
    }, []);

    const handleCreate = () => {
        setEditingCompania(undefined);
        setShowForm(true);
    };

    const handleEdit = (compania: CompaniaSeguros) => {
        setEditingCompania(compania);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta compañía?')) {
            try {
                await api.deleteCompaniaSeguros(id);
                loadCompanias();
            } catch (err) {
                console.error(err);
                alert('Error al eliminar');
            }
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        loadCompanias();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Compañías de Seguros</h1>
                        <p className="mt-2 text-gray-600">Gestión del catálogo de compañías de seguros.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40"
                    >
                        + Nueva Compañía
                    </button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg">
                            <CompaniaForm
                                initialData={editingCompania}
                                onSuccess={handleFormSuccess}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold">ID</th>
                                    <th className="px-6 py-4 font-bold">Nombre</th>
                                    <th className="px-6 py-4 font-bold">Dirección</th>
                                    <th className="px-6 py-4 font-bold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            Cargando...
                                        </td>
                                    </tr>
                                ) : companias.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            No hay compañías registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    companias.map((compania) => (
                                        <tr key={compania.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{compania.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{compania.nombre}</td>
                                            <td className="px-6 py-4">{compania.direccion || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(compania)}
                                                    className="mr-3 font-medium text-blue-600 hover:underline"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(compania.id)}
                                                    className="font-medium text-red-600 hover:underline"
                                                >
                                                    Eliminar
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
        </div>
    );
}
