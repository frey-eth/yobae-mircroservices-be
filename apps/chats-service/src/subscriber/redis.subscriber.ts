/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { SessionManager } from '../session/session.manager';

@Injectable()
export class RedisSubscriber implements OnModuleInit {
  private subscriber: Redis;
  constructor(private sessionManager: SessionManager) {}
  onModuleInit() {
    this.subscriber = new Redis({ host: 'localhost', port: 6379 });
    this.subscriber.subscribe('chat', (err) => {
      if (err) console.error('Failed to subscribe: ', err);
    });

    this.subscriber.on('message', (channel, message) => {
      const { clientId, payload } = JSON.parse(message);
      this.sessionManager.sendMessage(clientId, payload);
    });
  }
}
