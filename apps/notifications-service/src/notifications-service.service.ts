import { Injectable } from '@nestjs/common';
import { ROUTING_KEYS } from 'shared/events';

@Injectable()
export class NotificationsServiceService {
  getHello(): string {
    return 'Hello World!';
  }

  /** Handle booking/payment events: push, email, WebSocket. */
  handleBookingEvent(routingKey: string, payload: Record<string, unknown>) {
    switch (routingKey) {
      case ROUTING_KEYS.BOOKING_CONFIRMED:
        // TODO: push to user + friend, send email
        console.log('Booking confirmed', payload);
        break;
      case ROUTING_KEYS.BOOKING_FAILED:
        console.log('Booking failed', payload);
        break;
      case ROUTING_KEYS.BOOKING_CANCELLED:
        console.log('Booking cancelled', payload);
        break;
      case ROUTING_KEYS.PAYMENT_COMPLETED:
        console.log('Payment completed', payload);
        break;
      case ROUTING_KEYS.PAYMENT_FAILED:
        console.log('Payment failed', payload);
        break;
      default:
        console.log('Unknown event', routingKey, payload);
    }
  }
}
