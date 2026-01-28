import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'shared/constants/jwt-constant';

@Module({
  imports: [
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
