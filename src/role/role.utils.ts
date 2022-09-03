import { JwtPayload } from '@/auth/jwt/jwt-payload.interface';

export function hasPermission(payload: JwtPayload, permissions: number[]): boolean {
    for (let idx = 0; idx < permissions.length; ++idx) {
        if (
            payload.perms.includes(permissions[idx]) &&
            !payload.d_perms.includes(permissions[idx])
        ) {
            return true;
        }
    }

    return false;
}
