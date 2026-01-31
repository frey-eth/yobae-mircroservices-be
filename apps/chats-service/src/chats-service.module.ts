import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { ChatGateway } from './database/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/yobae-chats'),
    DatabaseModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class ChatsServiceModule {}
