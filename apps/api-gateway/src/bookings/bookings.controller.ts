import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}
  @Post()
  createBooking(@Body() createBookingDto: { date: string; userId: string }) {
    try {
      this.bookingService.createBooking(createBookingDto);
      return {
        message: 'Booking created successfully',
        booking: createBookingDto,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create booking with error' + error,
        500,
      );
    }
  }
}
