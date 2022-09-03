export interface JwtPayload {
    _id: string;
    username: string;
    roles: string[];
    permissions: number[];
    disabledRoles?: string[];
    disabledPermissions?: number[];
}
