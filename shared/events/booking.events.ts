/**
 * RabbitMQ Topic Exchange: booking_events
 * Routing keys and payload types for booking lifecycle.
 */

export const BOOKING_EXCHANGE = 'booking_events';
export const EXCHANGE_TYPE = 'topic';

export const ROUTING_KEYS = {
  BOOKING_CREATED: 'booking.created',
  BOOKING_CONFIRMED: 'booking.confirmed',
  BOOKING_FAILED: 'booking.failed',
  BOOKING_CANCELLED: 'booking.cancelled',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
} as const;

export interface BookingCreatedPayload {
  bookingId: string;
  userId: string;
  hostId: string;
  startAt: string;
  endAt: string;
  amount: number;
  createdAt: string; // ISO
}

export interface BookingConfirmedPayload {
  bookingId: string;
  userId: string;
  hostId: string;
  startAt: string;
  endAt: string;
  amount: number;
  confirmedAt: string;
}

export interface BookingFailedPayload {
  bookingId: string;
  userId: string;
  reason: string;
  failedAt: string;
}

export interface BookingCancelledPayload {
  bookingId: string;
  userId: string;
  hostId: string;
  reason?: string;
  cancelledAt: string;
}

export interface PaymentCompletedPayload {
  paymentId: string;
  bookingId: string;
  userId: string;
  amount: number;
  completedAt: string;
}

export interface PaymentFailedPayload {
  paymentId?: string;
  bookingId: string;
  userId: string;
  reason: string;
  failedAt: string;
}

export type BookingEventPayload =
  | BookingCreatedPayload
  | BookingConfirmedPayload
  | BookingFailedPayload
  | BookingCancelledPayload
  | PaymentCompletedPayload
  | PaymentFailedPayload;
