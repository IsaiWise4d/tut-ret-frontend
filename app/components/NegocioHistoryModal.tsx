'use client';

import { NegocioHistory } from "@/app/types/negocios";

interface NegocioHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: NegocioHistory[];
    isLoading: boolean;
}

export default function NegocioHistoryModal({ isOpen, onClose, history, isLoading }: NegocioHistoryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Historial de Cambios</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <p className="text-center text-gray-500">No hay historial disponible.</p>
                    ) : (
                        <div className="space-y-6">
                            {history.map((entry) => (
                                <div key={entry.version} className="relative border-l-2 border-blue-200 pl-6 pb-2 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500"></div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm font-bold text-blue-600">Versión {entry.version}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(entry.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="rounded-md bg-gray-50 p-3 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="font-semibold text-gray-600">Corredor:</span>{' '}
                                                <span className="text-gray-800">{entry.data.corredor}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Compañía:</span>{' '}
                                                <span className="text-gray-800">{entry.data.compania}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Ubicación ID:</span>{' '}
                                                <span className="text-gray-800">{entry.data.ubicacion_id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t px-6 py-4 text-right">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
