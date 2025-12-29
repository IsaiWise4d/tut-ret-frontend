'use client';

import { useState, useEffect } from 'react';
import { NegocioHistory, CorredorReaseguros, CompaniaSeguros } from "@/app/types/negocios";
import { Asegurado, Ubicacion } from "@/app/types/asegurados";
import { getCorredoresReaseguros, getCompaniasSeguros, getAsegurados, getUbicaciones } from "@/app/lib/api";

interface NegocioHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: NegocioHistory[];
    isLoading: boolean;
}

export default function NegocioHistoryModal({ isOpen, onClose, history, isLoading }: NegocioHistoryModalProps) {
    const [corredores, setCorredores] = useState<Map<number, string>>(new Map());
    const [companias, setCompanias] = useState<Map<number, string>>(new Map());
    const [asegurados, setAsegurados] = useState<Map<number, string>>(new Map());
    const [ubicaciones, setUbicaciones] = useState<Map<number, string>>(new Map());
    const [catalogsLoaded, setCatalogsLoaded] = useState(false);

    useEffect(() => {
        if (isOpen && !catalogsLoaded) {
            const loadCatalogs = async () => {
                try {
                    const [cData, coData, aData, uData] = await Promise.all([
                        getCorredoresReaseguros(),
                        getCompaniasSeguros(),
                        getAsegurados(),
                        getUbicaciones()
                    ]);

                    const cMap = new Map();
                    cData.forEach(c => cMap.set(c.id, c.nombre));
                    setCorredores(cMap);

                    const coMap = new Map();
                    coData.forEach(c => coMap.set(c.id, c.nombre));
                    setCompanias(coMap);

                    const aMap = new Map();
                    aData.forEach(a => aMap.set(a.id, a.razon_social));
                    setAsegurados(aMap);

                    const uMap = new Map();
                    uData.forEach(u => uMap.set(u.id, `${u.ciudad} - ${u.direccion}`));
                    setUbicaciones(uMap);

                    setCatalogsLoaded(true);
                } catch (err) {
                    console.error("Error loading catalogs for history:", err);
                }
            };
            loadCatalogs();
        }
    }, [isOpen, catalogsLoaded]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl ring-1 ring-gray-200">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Historial de Cambios</h3>
                        <p className="text-xs text-gray-500">Registro de auditoría del negocio</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                    >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <svg className="mb-3 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500">No hay historial disponible para este negocio.</p>
                        </div>
                    ) : (
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                            {history.map((entry) => (
                                <div key={entry.id} className="relative flex items-start group">
                                    <div className="absolute left-0 h-2 w-2 mt-2 ml-4 rounded-full border border-white bg-gray-300 ring-4 ring-white group-hover:bg-blue-500 transition-colors"></div>
                                    
                                    <div className="ml-12 w-full rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    entry.tipo_cambio === 'CREACION' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {entry.tipo_cambio}
                                                </span>
                                                {entry.created_by && (
                                                    <span className="text-xs text-gray-500 font-medium border-l border-gray-300 pl-2 ml-1">
                                                        Por: {entry.created_by.full_name || entry.created_by.username}
                                                    </span>
                                                )}
                                            </div>
                                            <time className="text-xs font-medium text-gray-500">
                                                {new Date(entry.created_at).toLocaleString()}
                                            </time>
                                        </div>

                                        <div className="mt-2">
                                            <DiffView 
                                                oldState={entry.estado_anterior} 
                                                newState={entry.estado_nuevo} 
                                                catalogs={{ corredores, companias, asegurados, ubicaciones }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

interface Catalogs {
    corredores: Map<number, string>;
    companias: Map<number, string>;
    asegurados: Map<number, string>;
    ubicaciones: Map<number, string>;
}

function DiffView({ oldState, newState, catalogs }: { oldState: any, newState: any, catalogs: Catalogs }) {
    
    const formatValue = (key: string, value: any) => {
        if (value === null || value === undefined) return 'N/A';
        
        // If backend already sent a string (from my previous backend change), use it.
        if (typeof value === 'string' && isNaN(Number(value))) return value;

        // If it's an ID (number or string number), try to resolve it
        const numValue = Number(value);
        if (!isNaN(numValue)) {
             // Try to match by exact key first
             if (key === 'corredor_id' && catalogs.corredores.has(numValue)) return catalogs.corredores.get(numValue);
             if (key === 'compania_id' && catalogs.companias.has(numValue)) return catalogs.companias.get(numValue);
             if (key === 'asegurado_id' && catalogs.asegurados.has(numValue)) return catalogs.asegurados.get(numValue);
             if (key === 'ubicacion_id' && catalogs.ubicaciones.has(numValue)) return catalogs.ubicaciones.get(numValue);

             // Fallback: Try to match by "formatted" key if backend sent readable keys but ID values (edge case)
             if (key === 'Corredor' && catalogs.corredores.has(numValue)) return catalogs.corredores.get(numValue);
             if (key === 'Compañía' && catalogs.companias.has(numValue)) return catalogs.companias.get(numValue);
             if (key === 'Asegurado' && catalogs.asegurados.has(numValue)) return catalogs.asegurados.get(numValue);
             if (key === 'Ubicación' && catalogs.ubicaciones.has(numValue)) return catalogs.ubicaciones.get(numValue);
        }

        return String(value);
    };

    const formatKey = (key: string) => {
        const map: Record<string, string> = {
            'corredor_id': 'Corredor',
            'compania_id': 'Compañía',
            'asegurado_id': 'Asegurado',
            'ubicacion_id': 'Ubicación',
            'codigo': 'Código'
        };
        return map[key] || key.replace(/_/g, ' ');
    };

    if (!oldState) {
        return (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-100">
                <p className="font-medium">Registro creado con los siguientes datos:</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {Object.entries(newState).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-green-100/50 py-1">
                            <span className="font-medium opacity-75 capitalize">{formatKey(key)}:</span>
                            <span>{formatValue(key, value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const changes = [];
    for (const key in newState) {
        // Simple comparison
        if (JSON.stringify(newState[key]) !== JSON.stringify(oldState[key])) {
            changes.push({
                key,
                oldVal: oldState[key],
                newVal: newState[key]
            });
        }
    }

    if (changes.length === 0) {
        return <p className="text-sm text-gray-500 italic">Se registró una actualización pero no se detectaron cambios en los datos principales.</p>;
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campo</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Anterior</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Nuevo</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {changes.map((change) => (
                        <tr key={change.key} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-xs font-medium text-gray-900 capitalize">
                                {formatKey(change.key)}
                            </td>
                            <td className="px-3 py-2 text-xs text-red-600 bg-red-50/50">
                                {formatValue(change.key, change.oldVal)}
                            </td>
                            <td className="px-3 py-2 text-xs text-green-600 bg-green-50/50 font-medium">
                                {formatValue(change.key, change.newVal)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
