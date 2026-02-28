import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50052',
        package: 'user',
        protoPath: join(process.cwd(), 'shared/proto/user.proto'),
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

  console.log('User service is listening on localhost:50052 (gRPC)');
  await app.listen();
}
bootstrap().catch((err) => {
  console.error('Error starting User service:', err);
});
