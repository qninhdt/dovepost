import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: number[]) => SetMetadata('permissions', permissions);
