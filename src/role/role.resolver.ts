import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRoleInput } from './dto/create-role.input';
import { Role } from './role.schema';
import { RoleService } from './role.service';

@Resolver(() => Role)
export class RoleResolver {
    constructor(private readonly roleService: RoleService) {}

    @Mutation(() => Role, { nullable: true })
    async createRole(@Args('data') data: CreateRoleInput): Promise<Role> {
        try {
            const role = await this.roleService.createRole(data);
            return role;
        } catch (err: any) {
            return null;
        }
    }
}
