import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'shared/constants/jwt-constant';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    UsersModule,
    BookingsModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
