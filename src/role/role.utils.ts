import { JwtPayload } from '@/auth/jwt-payload.interface';

export function checkRole(payload: JwtPayload, roles: string[]) {
    for (let idx = 0; idx < roles.length; ++idx) {
        if (payload.roles.includes(roles[idx])) {
            return true;
        }
    }

    return false;
}

export function hasPermission(payload: JwtPayload, permissions: number[]): boolean {
    for (let idx = 0; idx < permissions.length; ++idx) {
        if (payload.permissions.includes(permissions[idx])) {
            return true;
        }
    }

    return false;
}
