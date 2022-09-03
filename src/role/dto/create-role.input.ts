import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
    @Field()
    name: string;
    @Field()
    displayName: string;
    @Field()
    priority: number;
    @Field(() => [Number])
    permissions: number[];
}
