import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}
  @Post()
  createBooking(@Body() createBookingDto: { date: string; userId: string }) {
    try {
      return this.bookingService.createBooking(createBookingDto);
    } catch (error) {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
  }
}
