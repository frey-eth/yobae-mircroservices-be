/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BOOKING_EXCHANGE,
  EXCHANGE_TYPE,
  ROUTING_KEYS,
  type BookingCancelledPayload,
  type BookingConfirmedPayload,
  type BookingCreatedPayload,
  type BookingFailedPayload,
  type PaymentCompletedPayload,
  type PaymentFailedPayload,
} from '../events';

import {
  connect,
  ChannelWrapper,
  AmqpConnectionManager,
} from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { randomUUID } from 'crypto';

const DEFAULT_URL = 'amqp://user:password@localhost:5672';

interface EventEnvelope<T> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  service: string;
  data: T;
}

@Injectable()
export class BookingEventsPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BookingEventsPublisher.name);

  private connection!: AmqpConnectionManager;
  private channel!: ChannelWrapper;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url =
      this.configService.get<string>('RABBITMQ_URL') ??
      process.env.RABBITMQ_URL ??
      DEFAULT_URL;

    this.connection = connect([url], {
      reconnectTimeInSeconds: 5,
    });

    this.connection.on('connect', () => {
      this.logger.log('RabbitMQ connected');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.error('RabbitMQ disconnected', err?.err?.message);
    });

    this.channel = this.connection.createChannel({
      json: false,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(BOOKING_EXCHANGE, EXCHANGE_TYPE, {
          durable: true,
        });

        this.logger.log(
          `Exchange ${BOOKING_EXCHANGE} asserted (${EXCHANGE_TYPE})`,
        );
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.logger.log('RabbitMQ connection closed');
  }

  // ==========================
  // Core Publish Logic
  // ==========================

  private async publish<T>(
    routingKey: string,
    payload: T,
    correlationId?: string,
  ): Promise<void> {
    const event: EventEnvelope<T> = {
      eventId: randomUUID(),
      eventType: routingKey,
      occurredAt: new Date().toISOString(),
      service: 'booking-service',
      data: payload,
    };

    const content = Buffer.from(JSON.stringify(event));

    await this.channel.publish(BOOKING_EXCHANGE, routingKey, content);

    this.logger.debug(`Event published → ${routingKey} (${event.eventId})`);
  }

  // ==========================
  // Booking Events
  // ==========================

  async publishBookingCreated(payload: BookingCreatedPayload): Promise<void> {
    await this.publish(ROUTING_KEYS.BOOKING_CREATED, payload);
  }

  async publishBookingConfirmed(
    payload: BookingConfirmedPayload,
  ): Promise<void> {
    await this.publish(ROUTING_KEYS.BOOKING_CONFIRMED, payload);
  }

  async publishBookingFailed(payload: BookingFailedPayload): Promise<void> {
    await this.publish(ROUTING_KEYS.BOOKING_FAILED, payload);
  }

  async publishBookingCancelled(
    payload: BookingCancelledPayload,
  ): Promise<void> {
    await this.publish(ROUTING_KEYS.BOOKING_CANCELLED, payload);
  }

  // ==========================
  // Payment Events
  // ==========================

  async publishPaymentCompleted(
    payload: PaymentCompletedPayload,
  ): Promise<void> {
    await this.publish(ROUTING_KEYS.PAYMENT_COMPLETED, payload);
  }

  async publishPaymentFailed(payload: PaymentFailedPayload): Promise<void> {
    await this.publish(ROUTING_KEYS.PAYMENT_FAILED, payload);
  }
}
