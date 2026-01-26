import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      options: {
        package: 'auth',
        protoPath: join(process.cwd(), 'shared/proto/auth.proto'),
      },
    },
  );
  console.log('Auth Service is listening...');
  await app.listen();
}
bootstrap();
