import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class BookingsService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'bookings_queue',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  createBooking(bookingData: { userId: string; date: string }) {
    return this.client.send('create_booking', bookingData);
  }
}
