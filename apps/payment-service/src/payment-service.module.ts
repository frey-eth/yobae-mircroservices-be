import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
  ],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService],
})
export class PaymentServiceModule {}
