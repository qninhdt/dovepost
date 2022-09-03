import { Payload } from '@/auth/jwt/jwt-payload.decorator';
import { JwtPayload } from '@/auth/jwt/jwt-payload.interface';
import { Permission } from '@/role/permission/permission.constants';
import { Permissions } from '@/role/permission/permission.decorator';
import { Public } from '@/role/permission/public.decorator';
import { hasPermission } from '@/role/role.utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Args, GqlExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddUserRoleInput } from './dto/add-user-role.input';
import { RemoveUserRoleInput } from './dto/remove-user-role.input';
import { User } from './user.schema';
import { UserService } from './user.service';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
});

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => User, { nullable: true })
    async user(
        @Payload() payload: JwtPayload,
        @Args('_id', { type: () => String }) _id: string,
    ): Promise<Partial<User>> {
        const user = await this.userService.findOne({ _id });

        if (!user) return null;

        const res: any = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
        };

        if (user._id == payload._id || hasPermission(payload, [Permission.USER_VIEW_OTHER_EMAIL])) {
            res.email = user.email;
        }

        return res;
    }

    @Permissions(Permission.USER_ROLE_ADD)
    @Mutation(() => String)
    async addUserRole(
        @Payload() payload: JwtPayload,
        @Args({ name: 'data', type: () => AddUserRoleInput })
        data: AddUserRoleInput,
    ) {
        await this.userService.addUserRole(data);
        return 'ok';
    }

    @Permissions(Permission.USER_ROLE_ADD)
    @Mutation(() => String)
    async removeUserRole(
        @Payload() payload: JwtPayload,
        @Args({ name: 'data', type: () => RemoveUserRoleInput })
        data: RemoveUserRoleInput,
    ) {
        await this.userService.removeUserRole(data);
        return 'ok';
    }
}
