import { Controller } from '@nestjs/common';
import { BookingsServiceService } from './bookings-service.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class BookingsServiceController {
  constructor(
    private readonly bookingsServiceService: BookingsServiceService,
  ) {}

  @EventPattern('create_booking')
  createBooking(data: { date: string; userId: string }) {
    console.log('Received booking data:', data);
    return this.bookingsServiceService.createBooking(data);
  }
}
