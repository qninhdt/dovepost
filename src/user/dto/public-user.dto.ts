import { Role } from '@/role/role.schema';

// store public fields
export class PublicUserDto {
    _id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    permissions?: number[];
    roles?: Role[];
}
