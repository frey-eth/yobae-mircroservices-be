import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingEventsConsumer } from './booking-events.consumer';
import { NotificationsServiceController } from './notifications-service.controller';
import { NotificationsServiceService } from './notifications-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
  ],
  controllers: [NotificationsServiceController],
  providers: [NotificationsServiceService, BookingEventsConsumer],
})
export class NotificationsServiceModule {}
