import { NestFactory } from '@nestjs/core';
import { PaymentServiceModule } from './payment-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env.GRPC_URL ?? 'localhost:50054',
        package: 'payment',
        protoPath: join(process.cwd(), 'shared/proto/payment.proto'),
      },
    },
  );
  await app.listen();
}
bootstrap();
