'use client';

import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/app/types/auth';
import * as api from '@/app/lib/api';

import SessionExpiredModal from '@/app/components/SessionExpiredModal';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    // Verificar si hay un token guardado al cargar
    useEffect(() => {
        const checkAuth = async () => {
            const token = api.getToken();

            if (token) {
                try {
                    // Obtener información del usuario desde el backend
                    const userData = await api.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Error al obtener usuario:', error);
                    // Token inválido, limpiar
                    localStorage.removeItem('token');
                }
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Escuchar evento de sesión expirada
    useEffect(() => {
        const handleSessionExpired = () => {
            setIsSessionExpired(true);
            setUser(null); // Limpiamos usuario localmente también
        };

        if (typeof window !== 'undefined') {
            window.addEventListener(api.SESSION_EXPIRED_EVENT, handleSessionExpired);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener(api.SESSION_EXPIRED_EVENT, handleSessionExpired);
            }
        };
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await api.login(username, password);

            // Guardar el token (api.login ya devuelve LoginResponse con access y refresh)
            // Usamos helper de api.ts para consistencia
            api.setTokens(response.access_token, response.refresh_token);

            // Obtener información del usuario
            const userData = await api.getCurrentUser();
            setUser(userData);
            setIsSessionExpired(false); // Resetear estado si estaba expirado
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        api.clearTokens();
        setUser(null);
        setIsSessionExpired(false);
        // Redirección podría manejarse aquí o en ProtectedRoute al detectar !user
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await api.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Error al refrescar usuario:', error);
            logout();
        }
    };

    const handleExpiredLogin = () => {
        logout(); // Esto limpiará todo y redirigirá al login
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <SessionExpiredModal
                isOpen={isSessionExpired}
                onLogin={handleExpiredLogin}
            />
        </AuthContext.Provider>
    );
}
