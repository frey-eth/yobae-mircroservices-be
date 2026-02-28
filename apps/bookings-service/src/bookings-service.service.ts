import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import type { PaymentGrpcService } from 'shared/proto/services-interface';
import type { UsersGrpcService } from 'shared/proto/services-interface';
import { BookingEventsPublisher } from 'shared/rabbitmq';

export interface CreateBookingInput {
  userId: string;
  hostId: string;
  startAt: string;
  endAt: string;
  idempotencyKey: string;
}

@Injectable()
export class BookingsServiceService implements OnModuleInit {
  private paymentService: PaymentGrpcService;
  private userService: UsersGrpcService;

  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientGrpc,
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
    private readonly events: BookingEventsPublisher,
  ) {}

  onModuleInit() {
    this.paymentService = this.paymentClient.getService('PaymentService');
    this.userService = this.userClient.getService('UserService');
  }

  /** In production: use Redis or DB for idempotency store. */
  private idempotencyStore = new Map<string, { response: unknown }>();

  async createBooking(
    data: CreateBookingInput,
  ): Promise<{ status: string; bookingId?: string }> {
    const { idempotencyKey, userId, hostId, startAt, endAt } = data;

    const stored = this.idempotencyStore.get(idempotencyKey);
    if (stored)
      return stored.response as { status: string; bookingId?: string };

    const bookingId = `booking-${Date.now()}-${userId}`;

    try {
      // 1. Get host (user being booked) and their price
      const host = await firstValueFrom(
        this.userService.findById({ id: hostId }),
      );
      const h = host as { pricePerHour?: number; price_per_hour?: number };
      const pricePerHour = h.pricePerHour ?? h.price_per_hour ?? 0;
      if (pricePerHour <= 0) {
        throw new RpcException(
          'Host is not available for booking or has no price',
        );
      }
      const start = new Date(startAt).getTime();
      const end = new Date(endAt).getTime();
      const hours = Math.max(0, (end - start) / (1000 * 60 * 60));
      const amount = Math.round(hours * pricePerHour * 100) / 100;

      // 2. Deduct booker's balance (Saga: single step; no slot to release)
      const payment = await firstValueFrom(
        this.paymentService.deductBalance({
          userId,
          amount,
          bookingId,
          idempotencyKey,
        }),
      );
      if (!payment?.success) {
        throw new RpcException(payment?.message ?? 'Payment failed');
      }

      const now = new Date().toISOString();
      this.events.publishBookingConfirmed({
        bookingId,
        userId,
        hostId,
        startAt,
        endAt,
        amount,
        confirmedAt: now,
      });
      this.events.publishPaymentCompleted({
        paymentId: payment.paymentId ?? '',
        bookingId,
        userId,
        amount,
        completedAt: now,
      });

      const response = { status: 'confirmed', bookingId };
      this.idempotencyStore.set(idempotencyKey, { response });
      return response;
    } catch (err) {
      const now = new Date().toISOString();
      this.events.publishBookingFailed({
        bookingId,
        userId,
        reason: err instanceof Error ? err.message : 'Unknown error',
        failedAt: now,
      });
      const response = {
        status: 'failed',
        message: err instanceof Error ? err.message : 'Booking failed',
      };
      this.idempotencyStore.set(idempotencyKey, { response });
      throw new RpcException(response.message);
    }
  }
}
