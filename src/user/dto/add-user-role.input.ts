import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AddUserRoleInput {
    @Field(() => ID)
    userId: string;
    @Field(() => String)
    roleId: string;
}
