import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { join } from 'path';
import { RoleModule } from './role/role.module';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            debug: process.env.NODE_ENV == 'development',
            playground: process.env.NODE_ENV == 'development',
            autoSchemaFile: join(process.cwd(), 'schema.gql'),
            context: ({ req }) => ({ req }),
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        AuthModule,
        UserModule,
        RoleModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
