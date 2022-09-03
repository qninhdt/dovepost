import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUserDto } from './dto/public-user.dto';
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

    async addRoleToUser(userId: string, roleId: string) {
        return await this.userModel.updateOne({ _id: userId }, { $addToSet: { roles: roleId } });
    }

    async validate(validateUserDto: ValidateUserDto): Promise<PublicUserDto> {
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
            lastName: user.lasttName,
        };
    }

    async create(createUserDto: CreateUserDto): Promise<PublicUserDto> {
        const userWithSameEmail = await this.userModel.findOne({
            email: createUserDto.email,
        });

        if (userWithSameEmail) {
            throw new ConflictException('Email was used');
        }

        const user = await this.userModel.create(createUserDto);

        return {
            _id: user._id,
        };
    }
}
