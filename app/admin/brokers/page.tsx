'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import * as api from '@/app/lib/api';
import { Broker } from '@/app/types/negocios';
import BrokerForm from '@/app/components/forms/BrokerForm';

export default function BrokersPage() {
    return (
        <ProtectedRoute>
            <BrokersContent />
        </ProtectedRoute>
    );
}

function BrokersContent() {
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBroker, setEditingBroker] = useState<Broker | undefined>(undefined);

    const loadBrokers = async () => {
        try {
            setIsLoading(true);
            const data = await api.getBrokers();
            setBrokers(data);
        } catch (err) {
            console.error('Error al cargar brokers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBrokers();
    }, []);

    const handleCreate = () => {
        setEditingBroker(undefined);
        setShowForm(true);
    };

    const handleEdit = (broker: Broker) => {
        setEditingBroker(broker);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este broker?')) {
            try {
                await api.deleteBroker(id);
                loadBrokers();
            } catch (err) {
                console.error(err);
                alert('Error al eliminar');
            }
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        loadBrokers();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Brokers</h1>
                        <p className="mt-2 text-gray-600">Gestión del catálogo de brokers (intermediarios).</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40"
                    >
                        + Nuevo Broker
                    </button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg">
                            <BrokerForm
                                initialData={editingBroker}
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
                                    <th className="px-6 py-4 text-right font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : brokers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No hay brokers registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    brokers.map((broker) => (
                                        <tr key={broker.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{broker.id}</td>
                                            <td className="px-6 py-4 text-gray-900">{broker.nombre}</td>
                                            <td className="px-6 py-4 text-gray-500">{broker.direccion || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(broker)}
                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(broker.id)}
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
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
