'use client';

import { SlipHistory } from "@/app/types/slips";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SlipHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: SlipHistory[];
    isLoading: boolean;
}

export default function SlipHistoryModal({ isOpen, onClose, history, isLoading }: SlipHistoryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Historial de Cambios del Slip</h3>
                        <p className="text-xs text-gray-500">Registro de auditoría y cambios en campos JSON</p>
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

                <div className="overflow-y-auto px-6 py-6 grow">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <svg className="mb-3 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500">No hay historial disponible para este slip.</p>
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
                                                <span className="text-xs text-gray-400">
                                                    {format(new Date(entry.created_at), "d 'de' MMMM, yyyy HH:mm", { locale: es })}
                                                </span>
                                                {entry.created_by && (
                                                    <span className="text-xs text-gray-500 font-medium border-l border-gray-300 pl-2 ml-1">
                                                        Por: {entry.created_by.full_name || entry.created_by.username}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <DiffView oldData={entry.estado_anterior} newData={entry.estado_nuevo} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper to flatten object keys
const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    if (!obj || typeof obj !== 'object') {
        return { [prefix]: obj };
    }

    return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], pre + key));
        } else {
            acc[pre + key] = obj[key];
        }
        return acc;
    }, {} as Record<string, any>);
};

const DiffView = ({ oldData, newData }: { oldData: any, newData: any }) => {
    if (!oldData) {
        return (
            <div className="text-sm text-gray-500 italic">
                Registro creado inicialmente.
            </div>
        );
    }

    const oldFlat = flattenObject(oldData);
    const newFlat = flattenObject(newData);
    
    const allKeys = Array.from(new Set([...Object.keys(oldFlat), ...Object.keys(newFlat)]));
    
    const changes = allKeys.filter(key => {
        // Ignore internal fields or timestamps if needed
        if (key.includes('updated_at') || key.includes('created_at')) return false;
        return JSON.stringify(oldFlat[key]) !== JSON.stringify(newFlat[key]);
    });

    if (changes.length === 0) {
        return <div className="text-sm text-gray-400 italic">Sin cambios detectados</div>;
    }

    return (
        <div className="rounded-md bg-gray-50 p-3 text-sm">
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="pb-2 font-medium text-gray-500 w-1/3">Campo</th>
                        <th className="pb-2 font-medium text-gray-500 w-1/3">Anterior</th>
                        <th className="pb-2 font-medium text-gray-500 w-1/3">Nuevo</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {changes.map(key => (
                        <tr key={key}>
                            <td className="py-2 pr-2 font-medium text-gray-700 break-all">
                                {formatKey(key)}
                            </td>
                            <td className="py-2 pr-2 text-red-600 break-all bg-red-50/50 rounded px-1">
                                {formatValue(oldFlat[key])}
                            </td>
                            <td className="py-2 text-green-600 break-all bg-green-50/50 rounded px-1">
                                {formatValue(newFlat[key])}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const formatKey = (key: string) => {
    // Replace dots with arrows or spaces for better readability
    return key.replace(/_/g, ' ').replace(/\./g, ' → ');
};

const formatValue = (val: any) => {
    if (val === null || val === undefined) return <span className="text-gray-400 italic">Vacío</span>;
    if (typeof val === 'boolean') return val ? 'Sí' : 'No';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
};
