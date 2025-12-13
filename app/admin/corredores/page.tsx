'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import * as api from '@/app/lib/api';
import { CorredorReaseguros } from '@/app/types/negocios';
import CorredorForm from '@/app/components/forms/CorredorForm';

export default function CorredoresPage() {
    return (
        <ProtectedRoute>
            <CorredoresContent />
        </ProtectedRoute>
    );
}

function CorredoresContent() {
    const [corredores, setCorredores] = useState<CorredorReaseguros[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCorredor, setEditingCorredor] = useState<CorredorReaseguros | undefined>(undefined);

    const loadCorredores = async () => {
        try {
            setIsLoading(true);
            const data = await api.getCorredoresReaseguros();
            setCorredores(data);
        } catch (err) {
            console.error('Error al cargar corredores:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCorredores();
    }, []);

    const handleCreate = () => {
        setEditingCorredor(undefined);
        setShowForm(true);
    };

    const handleEdit = (corredor: CorredorReaseguros) => {
        setEditingCorredor(corredor);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este corredor?')) {
            try {
                await api.deleteCorredorReaseguros(id);
                loadCorredores();
            } catch (err) {
                console.error(err);
                alert('Error al eliminar');
            }
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        loadCorredores();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Corredores de Reaseguros</h1>
                        <p className="mt-2 text-gray-600">Gestión del catálogo de corredores.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40"
                    >
                        + Nuevo Corredor
                    </button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg">
                            <CorredorForm
                                initialData={editingCorredor}
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
                                ) : corredores.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            No hay corredores registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    corredores.map((corredor) => (
                                        <tr key={corredor.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{corredor.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{corredor.nombre}</td>
                                            <td className="px-6 py-4">{corredor.direccion || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(corredor)}
                                                    className="mr-3 font-medium text-blue-600 hover:underline"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(corredor.id)}
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
