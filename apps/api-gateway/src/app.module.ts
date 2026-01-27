import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_CLIENTS.BOOKINGS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'bookings_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    UsersModule,
    BookingsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
