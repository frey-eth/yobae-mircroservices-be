import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: 4001,
      },
    },
  );
  console.log('User service is listening on port 4001');
  await app.listen();
}
bootstrap();
