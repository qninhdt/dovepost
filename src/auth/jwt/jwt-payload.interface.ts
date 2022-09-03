export interface JwtPayload {
    _id: string;
    perms: number[];
    d_roles?: string[];
    d_perms?: number[];
}
