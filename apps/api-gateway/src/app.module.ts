import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_CLIENTS.USERS_SERVICE,
        transport: Transport.TCP,
        options: { port: 4001 },
      },

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
    BookingsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
