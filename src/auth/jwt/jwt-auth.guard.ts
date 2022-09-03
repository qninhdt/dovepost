import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { hasPermission } from '@/role/role.utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('is-public', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const requiredPermissions = this.reflector.getAllAndOverride<number[]>('permissions', [
            context.getHandler(),
            context.getClass(),
        ]);

        const { req } = GqlExecutionContext.create(context).getContext();
        await super.canActivate(new ExecutionContextHost([req]));
        const { user } = req;

        if (!requiredPermissions) {
            return true;
        }

        return hasPermission(user, requiredPermissions);
    }
}
