import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50051',
        package: 'auth',
        protoPath: join(process.cwd(), 'shared/proto/auth.proto'),
      },
    },
  );
  await app.listen();
}
bootstrap();
