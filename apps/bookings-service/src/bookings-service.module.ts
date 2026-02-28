import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BookingsServiceController } from './bookings-service.controller';
import { BookingsServiceService } from './bookings-service.service';
import { BookingEventsPublisher } from 'shared/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_GRPC_URL ?? 'localhost:50052',
          package: 'user',
          protoPath: join(process.cwd(), 'shared/proto/user.proto'),
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.PAYMENT_GRPC_URL ?? 'localhost:50054',
          package: 'payment',
          protoPath: join(process.cwd(), 'shared/proto/payment.proto'),
        },
      },
    ]),
  ],
  controllers: [BookingsServiceController],
  providers: [BookingEventsPublisher, BookingsServiceService],
})
export class BookingsServiceModule {}
