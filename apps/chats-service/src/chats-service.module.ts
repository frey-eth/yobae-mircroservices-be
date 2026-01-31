import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'shared/constants/jwt-constant';
import { SessionManager } from './session/session.manager';
import { RedisSubscriber } from './subscriber/redis.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/yobae-chats'),
    DatabaseModule,
  ],
  controllers: [],
  providers: [ChatGateway, SessionManager, RedisSubscriber],
})
export class ChatsServiceModule {}
