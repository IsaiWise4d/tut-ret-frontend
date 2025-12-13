'use client';

import { useState, useEffect } from 'react';
import { CorredorReaseguros } from '@/app/types/negocios';
import { createCorredorReaseguros, updateCorredorReaseguros } from '@/app/lib/api';

interface CorredorFormProps {
    initialData?: CorredorReaseguros;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CorredorForm({ initialData, onSuccess, onCancel }: CorredorFormProps) {
    const [nombre, setNombre] = useState(initialData?.nombre || '');
    const [direccion, setDireccion] = useState(initialData?.direccion || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEditing && initialData) {
                await updateCorredorReaseguros(initialData.id, { nombre, direccion });
            } else {
                await createCorredorReaseguros({ nombre, direccion });
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al guardar el corredor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto border border-zinc-100">
            <div className="border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Editar Corredor' : 'Nuevo Corredor'}
                </h2>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-bold text-gray-800 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-gray-50 focus:bg-white transition-colors duration-200"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="direccion" className="block text-sm font-bold text-gray-800 mb-1">
                        Dirección (Opcional)
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-gray-50 focus:bg-white transition-colors duration-200"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-xl border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 transition-all duration-200"
                >
                    {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                </button>
            </div>
        </form>
    );
}
