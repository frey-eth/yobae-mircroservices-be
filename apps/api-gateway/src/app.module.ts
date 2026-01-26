import { MICROSERVICE_CLIENTS } from 'apps/api-gateway/constant';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';
import { BookingsModule } from './bookings/bookings.module';
import { join } from 'node:path';

@Module({
  imports: [
    ClientsModule.register([
      // Users Service Microservice Client
      {
        name: MICROSERVICE_CLIENTS.USERS_SERVICE,
        transport: Transport.TCP,
        options: { port: 4001 },
      },
      // Bookings Service Microservice Client
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
      // Auth Service Microservice Client
      {
        name: MICROSERVICE_CLIENTS.AUTH_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), 'shared/proto/auth.proto'),
        },
      },
    ]),
    BookingsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
