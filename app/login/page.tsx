'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Obtener la URL de redirección o usar /dashboard por defecto
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            // Redirección después del login exitoso
            router.push(redirectTo);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo y título */}
                <div className="text-center">
                    <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-purple-500/50">
                        <span className="text-3xl font-bold text-white">TR</span>
                    </div>
                    <h2 className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600">
                        Accede a tu cuenta de TUT-RE
                    </p>
                </div>

                {/* Formulario */}
                <div className="rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-700">
                                Usuario
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                                    placeholder="Ingresa tu usuario"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                                    placeholder="Ingresa tu contraseña"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02] hover:shadow-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>Iniciando sesión...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Iniciar Sesión
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Link a home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm font-medium text-blue-600 hover:text-purple-600 transition-colors"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
