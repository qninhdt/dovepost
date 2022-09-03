import { Public } from '@/role/permission/public.decorator';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { PublicUserDto } from '@/user/dto/public-user.dto';
import { ValidateUserDto } from '@/user/dto/validate-user.dto';
import { User } from '@/user/user.schema';
import { UserService } from '@/user/user.service';
import { Controller } from '@nestjs/common';
import { Body, HttpCode, Post } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginForm: ValidateUserDto): Promise<any> {
        const user = await this.userService.validate(loginForm);

        return {
            statusCode: HttpStatus.OK,
            message: 'Login successful',
            accessToken: this.generateJwtToken(user),
            user,
        };
    }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerForm: CreateUserDto): Promise<any> {
        const user = await this.userService.create(registerForm);

        return {
            status: HttpStatus.CREATED,
            message: 'Your account was created',
            accessToken: this.generateJwtToken(user),
            user,
        };
    }

    generateJwtToken(user: Partial<User>): string {
        const disabledPermissions = (user.disabledPermissions || []).map(({ _id }) => _id);
        const disabledRoles = (user.disabledRoles || []).map(({ _id }) => _id);

        const payload: JwtPayload = {
            _id: user._id,
            perms: user.permissions,
            d_perms: disabledPermissions,
            d_roles: disabledRoles,
        };

        return this.jwtService.sign(payload);
    }
}
