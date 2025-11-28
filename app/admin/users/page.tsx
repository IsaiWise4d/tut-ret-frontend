'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import * as api from '@/app/lib/api';
import { User, CreateUserData, Role } from '@/app/types/auth';
import { ROLES, ROLE_OPTIONS } from '@/app/constants/roles';

export default function UsersPage() {
    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <UsersContent />
        </ProtectedRoute>
    );
}

function UsersContent() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Estados del formulario
    const [formData, setFormData] = useState<CreateUserData>({
        username: '',
        email: '',
        password: '',
        role: 'FACILITADOR',
        full_name: '',
    });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar usuarios
    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await api.getUsers();
            setUsers(data);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'FACILITADOR',
            full_name: '',
        });
        setEditingUser(null);
        setFormError('');
        setShowForm(false);
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '', // No llenamos la contraseña al editar
            role: user.role,
            full_name: user.full_name || '',
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        try {
            if (editingUser) {
                // Actualizar usuario
                const updateData: Partial<CreateUserData> = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                    full_name: formData.full_name,
                };

                // Solo enviar password si se escribió algo
                if (formData.password) {
                    updateData.password = formData.password;
                }

                await api.updateUser(editingUser.id, updateData);
            } else {
                // Crear usuario
                console.log('Datos a enviar:', formData);
                await api.createUser(formData);
            }

            resetForm();
            await loadUsers();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Error al guardar usuario');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Eliminar usuario
    const handleDeleteUser = async (userId: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            return;
        }

        try {
            await api.deleteUser(userId);
            await loadUsers();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al eliminar usuario');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                                Gestión de Usuarios
                            </h1>
                            <p className="mt-2 text-zinc-600">
                                Panel de administración para gestionar usuarios del sistema
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02] hover:shadow-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                            </svg>
                            {showForm ? 'Cancelar' : 'Crear Usuario'}
                        </button>
                    </div>
                </div>

                {/* Formulario de crear/editar usuario */}
                {showForm && (
                    <div className="mb-8 rounded-2xl bg-white p-6 shadow-xl shadow-zinc-200/50">
                        <h2 className="mb-4 text-xl font-semibold text-zinc-800">
                            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>

                        {formError && (
                            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-zinc-700">
                                    Usuario *
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="full_name" className="block text-sm font-medium text-zinc-700">
                                    Nombre Completo
                                </label>
                                <input
                                    id="full_name"
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-zinc-700">
                                    Rol *
                                </label>
                                <select
                                    id="role"
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="FACILITADOR">Facilitador</option>
                                    <option value="COTIZADOR">Cotizador</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                                    {editingUser ? 'Contraseña (dejar en blanco para mantener actual)' : 'Contraseña *'}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02] hover:shadow-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            {editingUser ? 'Guardando...' : 'Creando...'}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Error general */}
                {error && (
                    <div className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                        {error}
                    </div>
                )}

                {/* Lista de usuarios */}
                <div className="rounded-2xl bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-200">
                        <h2 className="text-lg font-semibold text-zinc-800">Usuarios Registrados</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            No hay usuarios registrados
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 bg-white">
                                    {users.map((user) => (
                                        <tr key={user.id} className="transition-colors hover:bg-zinc-50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900">
                                                {user.username}
                                                {user.id === currentUser?.id && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                        Tú
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                                {user.email}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                                                {user.full_name || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.role === 'SUPER_ADMIN'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {user.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(user)}
                                                        disabled={user.id === currentUser?.id}
                                                        className="text-blue-600 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={user.id === currentUser?.id}
                                                        className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
