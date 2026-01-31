import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SessionManager {
  private sessions = new Map<string, Socket>();

  register(clientId: string, socket: Socket) {
    this.sessions.set(clientId, socket);
  }

  remove(clientId: string) {
    this.sessions.delete(clientId);
  }

  sendMessage(clientId: string, message: string) {
    const socket = this.sessions.get(clientId);
    if (socket) {
      socket.emit('receiveMessage', message);
    }
  }
}
