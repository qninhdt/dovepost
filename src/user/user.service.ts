import { LowLevelPermissions } from '@/role/permission/permission.constants';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AddUserRoleInput } from './dto/add-user-role.input';
import { CreateUserDto } from './dto/create-user.dto';
import { RemoveUserRoleInput } from './dto/remove-user-role.input';
import { ValidateUserDto } from './dto/validate-user.dto';
import { User } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    async findOne(params: any): Promise<User> {
        const filter: any = {};
        if (params._id != undefined) filter._id = params._id;
        if (params.email != undefined) filter.email = params.email;
        if (params.username != undefined) filter.username = params.username;

        if (!filter) return null;

        try {
            return await this.userModel.findOne(filter);
        } catch (err: any) {
            return null;
        }
    }

    private async reloadPermissions(userId: string) {
        const users = await this.userModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    localField: 'roles',
                    foreignField: '_id',
                    from: 'roles',
                    as: 'roles',
                },
            },
        ]);

        const user: User = users[0];
        const permissionSet = new Set(LowLevelPermissions);

        user.roles.forEach((role) => {
            role.permissions.forEach((_id) => permissionSet.add(_id));
        });

        await this.userModel.updateOne({ _id: userId }, { permissions: [...permissionSet] });
    }

    async addUserRole(data: AddUserRoleInput) {
        await this.userModel.updateOne({ _id: data.userId }, { $addToSet: { roles: data.roleId } });
        await this.reloadPermissions(data.userId);
    }

    async removeUserRole(data: RemoveUserRoleInput) {
        await this.userModel.updateOne({ _id: data.userId }, { $pull: { roles: data.roleId } });
        await this.reloadPermissions(data.userId);
    }

    async validate(validateUserDto: ValidateUserDto): Promise<Partial<User>> {
        const user = await this.findOne({
            email: validateUserDto.email,
            username: validateUserDto.username,
        });

        if (!user || validateUserDto.password != user.password) {
            const loginMethod = 'username' in validateUserDto ? 'username' : 'email';
            throw new UnauthorizedException(`Your ${loginMethod} or password is incorrect`);
        }

        return {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
            permissions: user.permissions,
        };
    }

    async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
        const userWithSameEmail = await this.userModel.findOne({
            email: createUserDto.email,
        });

        if (userWithSameEmail) {
            throw new ConflictException('Email was used');
        }

        const user: User = await this.userModel.create({
            ...createUserDto,
            permissions: LowLevelPermissions,
        });

        return {
            _id: user._id,
            permissions: user.permissions,
        };
    }
}
