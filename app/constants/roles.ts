import { Role } from '@/app/types/auth';

export const ROLES: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  DATA_ENTRY: 'Data Entry',
  FACILITADOR: 'Facilitador',
  COTIZADOR: 'Cotizador',
};

export const ROLE_OPTIONS = Object.entries(ROLES).map(([value, label]) => ({
  value: value as Role,
  label,
}));
