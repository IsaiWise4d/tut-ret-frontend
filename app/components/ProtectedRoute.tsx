'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { Role } from '@/app/types/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    allowedRoles,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Si no está autenticado, redirigir al login
            if (!isAuthenticated) {
                router.push(redirectTo);
                return;
            }

            // Si está autenticado pero no tiene el rol requerido
            if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                router.push('/'); // Redirigir a home si no tiene permisos
                return;
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router, redirectTo]);

    // Mostrar loading mientras se verifica
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    // Si no está autenticado o no tiene permisos, no mostrar nada (la redirección ya se hizo)
    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return null;
    }

    // Si todo está bien, mostrar el contenido
    return <>{children}</>;
}
