import { Controller } from '@nestjs/common';
import { BookingsServiceService } from './bookings-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class BookingsServiceController {
  constructor(
    private readonly bookingsServiceService: BookingsServiceService,
  ) {}

  @MessagePattern('create_booking')
  createBooking(data: { date: string; userId: string }) {
    return this.bookingsServiceService.createBooking(data);
  }
}
