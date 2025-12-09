'use client';

import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/app/types/auth';
import * as api from '@/app/lib/api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const login = async (username: string, password: string) => {
        try {
            const response = await api.login(username, password);

            // Guardar el token
            localStorage.setItem('token', response.access_token);

            // Obtener información del usuario
            const userData = await api.getCurrentUser();
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
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

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
