import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp from 'amqplib';
import { BOOKING_EXCHANGE, EXCHANGE_TYPE, ROUTING_KEYS } from 'shared/events';
import { NotificationsServiceService } from './notifications-service.service';

const DEFAULT_URL = 'amqp://user:password@localhost:5672';
const QUEUE = 'notifications_booking_events';

@Injectable()
export class BookingEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(
    private readonly notifications: NotificationsServiceService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const url =
      this.configService.get<string>('RABBITMQ_URL') ??
      process.env.RABBITMQ_URL ??
      DEFAULT_URL;
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(BOOKING_EXCHANGE, EXCHANGE_TYPE, {
      durable: true,
    });
    await this.channel.assertQueue(QUEUE, { durable: true });
    await this.channel.bindQueue(QUEUE, BOOKING_EXCHANGE, 'booking.#');
    await this.channel.bindQueue(
      QUEUE,
      BOOKING_EXCHANGE,
      ROUTING_KEYS.PAYMENT_COMPLETED,
    );
    await this.channel.bindQueue(
      QUEUE,
      BOOKING_EXCHANGE,
      ROUTING_KEYS.PAYMENT_FAILED,
    );
    await this.channel.consume(
      QUEUE,
      async (msg) => {
        if (!msg) return;
        try {
          const payload = JSON.parse(msg.content.toString());
          const routingKey = msg.fields.routingKey;
          await this.notifications.handleBookingEvent(routingKey, payload);
          this.channel?.ack(msg);
        } catch (err) {
          // Nack and requeue or send to DLQ in production
          this.channel?.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch {
      // ignore
    }
  }
}
