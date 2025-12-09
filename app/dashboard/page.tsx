'use client';

import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-zinc-900">
                        Bienvenido, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.username || user?.full_name || 'Usuario'}</span>
                    </h1>
                    <p className="mt-4 text-lg text-zinc-600">
                        Selecciona un módulo para comenzar
                    </p>
                </div>

                {/* Grid de Módulos */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Módulo Formularios - Disponible para todos */}
                    <Link
                        href="/forms"
                        className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-zinc-900">Formularios</h3>
                            <p className="text-zinc-600">
                                Accede a los formularios de cotización, cobertura y más.
                            </p>
                            <div className="mt-6 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                Ir a formularios
                                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Módulo Asegurados - Disponible para todos */}
                    <Link
                        href="/admin/asegurados"
                        className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-teal-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-zinc-900">Asegurados</h3>
                            <p className="text-zinc-600">
                                Gestiona asegurados y sus ubicaciones.
                            </p>
                            <div className="mt-6 flex items-center text-sm font-medium text-green-600 group-hover:text-green-700">
                                Ir a asegurados
                                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Módulo Caracterización del Negocio */}
                    <Link
                        href="/dashboard/negocios"
                        className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-red-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-zinc-900">Caracterización del Negocio</h3>
                            <p className="text-zinc-600">
                                Gestiona la vinculación de clientes, ubicaciones y aseguradoras.
                            </p>
                            <div className="mt-6 flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
                                Ir a negocios
                                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Módulo Usuarios - Solo SUPER_ADMIN */}
                    {user?.role === 'SUPER_ADMIN' && (
                        <Link
                            href="/admin/users"
                            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-zinc-900">Gestión de Usuarios</h3>
                                <p className="text-zinc-600">
                                    Administra usuarios, roles y permisos del sistema.
                                </p>
                                <div className="mt-6 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                                    Administrar usuarios
                                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    )}

                </div>
            </div>
        </div>
    );
}
