import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class Role {
    // _id
    @Field(() => String)
    _id: string;
    // name
    @Prop({ unique: true })
    @Field(() => String)
    name: string;
    // displayName
    @Prop()
    @Field(() => String)
    displayName: string;
    // priority
    @Prop()
    @Field()
    priority: number;
    // permissions
    @Prop(() => [Number])
    @Field(() => [Number])
    permissions: number[];
}

export type RoleDocument = Role & Document;

export const RoleSchema = SchemaFactory.createForClass(Role);
