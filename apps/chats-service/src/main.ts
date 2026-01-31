import { NestFactory } from '@nestjs/core';
import { ChatsServiceModule } from './chats-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatsServiceModule);
  app.enableCors({ origin: true });
  await app.listen(8386);
  console.log('Chats Service is listening on ', await app.getUrl());
}
bootstrap();
