import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new RpcException(errors),
    }),
  );
  console.log('User service is listening on port 4001');
  await app.listen();
}
bootstrap().catch((err) => {
  console.error('Error starting User service:', err);
});
