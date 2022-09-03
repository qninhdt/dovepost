import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleResolver } from './role.resolver';
import { Role, RoleSchema } from './role.schema';
import { RoleService } from './role.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
    providers: [RoleService, RoleResolver],
})
export class RoleModule {}
