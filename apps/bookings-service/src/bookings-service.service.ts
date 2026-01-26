import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsServiceService {
  createBooking(data: { date: string; userId: string }) {
    console.log('Received booking data:', data);
    return { status: 'Booking created', booking: data };
  }
}
