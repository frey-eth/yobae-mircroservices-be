import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsServiceService {
  createBooking(data: { date: string; userId: string }) {
    // Here you would typically save the booking to a database
    console.log('Received booking data:', data);
    return { status: 'Booking created', booking: data };
  }
}
