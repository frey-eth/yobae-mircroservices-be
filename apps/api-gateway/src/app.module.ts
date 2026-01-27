import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, BookingsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
