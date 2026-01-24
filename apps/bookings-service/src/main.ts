import { NestFactory } from '@nestjs/core';
import { BookingsServiceModule } from './bookings-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingsServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'bookings_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  console.log('Bookings service is listening on RabbitMQ');
  await app.listen();
}

bootstrap();
