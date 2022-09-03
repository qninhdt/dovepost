import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveUserRoleInput {
    @Field(() => ID)
    userId: string;
    @Field(() => String)
    roleId: string;
}
