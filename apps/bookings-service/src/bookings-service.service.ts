import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsServiceService {
  createBooking(data: { date: string; userId: string }) {
    // Here you would typically save the booking to a database
    console.log(
      `Creating booking for user ${data.userId} on date ${data.date}`,
    );
    return { status: 'Booking created', booking: data };
  }
}
