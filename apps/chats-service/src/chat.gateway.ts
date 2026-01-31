/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { SessionManager } from './session/session.manager';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private publisher = new Redis({ host: 'localhost', port: 6379 });
  constructor(private sessionManager: SessionManager) {}

  handleConnection(client: Socket) {
    const clientId = client.handshake.query.clientId as string;
    this.sessionManager.register(clientId, client);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.handshake.query.clientId as string;
    this.sessionManager.remove(clientId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { message: string; clientId: string },
  ) {
    await this.publisher.publish(
      'chat',
      JSON.stringify({ clientId: data.clientId, payload: data.message }),
    );
  }
}
