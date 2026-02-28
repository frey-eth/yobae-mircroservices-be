import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { MessagePattern } from '@nestjs/microservices';
import { BookingsServiceService } from './bookings-service.service';
import type { CreateBookingInput } from './bookings-service.service';

@Controller()
export class BookingsServiceController {
  constructor(
    private readonly bookingsServiceService: BookingsServiceService,
  ) {}

  @MessagePattern('create_booking')
  createBooking(@Payload() data: CreateBookingInput) {
    return this.bookingsServiceService.createBooking(data);
  }
}
