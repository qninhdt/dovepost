import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleInput } from './dto/create-role.input';
import { Role } from './role.schema';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name)
        private readonly roleModel: Model<Role>,
    ) {}

    async createRole(createRoleInput: CreateRoleInput): Promise<Role> {
        return await this.roleModel.create(createRoleInput);
    }
}
