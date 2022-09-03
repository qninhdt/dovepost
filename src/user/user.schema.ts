import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from '@/role/role.schema';

@Schema({ versionKey: false })
@ObjectType()
export class User {
    // id
    @Field(() => String)
    _id: string;
    // username
    @Prop({ unique: true, sparse: true })
    @Field(() => String, { nullable: true })
    username: string;
    // firstName
    @Prop()
    @Field(() => String, { nullable: true })
    firstName: string;
    // lastName
    @Prop()
    @Field(() => String, { nullable: true })
    lasttName: string;
    // email
    @Prop({ unique: true, required: true })
    @Field(() => String)
    email: string;
    // password
    @Prop({ required: true })
    password: string;
    // roles
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
    @Field(() => [String])
    roles: Role[];
    // disabledRoles
    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
            expiryDate: { type: Date },
        },
    })
    @Field(() => [DisabledRole])
    disabledRoles: DisabledRole[];
    // disabledPermissions
    @Prop({ type: { _id: { type: Number }, expiryDate: { type: Date } } })
    @Field(() => [DisabledPermission])
    disabledPermissions: DisabledPermission[];
}

@ObjectType()
export class DisabledRole {
    @Field(() => String)
    _id: string;
    @Field(() => Date, { nullable: true })
    expiryDate: Date;
}

@ObjectType()
export class DisabledPermission {
    @Field(() => String)
    _id: string;
    @Field(() => Date, { nullable: true })
    expiryDate: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
