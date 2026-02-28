import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentServiceService } from './payment-service.service';

@Controller()
export class PaymentServiceController {
  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  @GrpcMethod('PaymentService', 'DeductBalance')
  deductBalance(data: {
    userId: string;
    amount: number;
    bookingId: string;
    idempotencyKey: string;
  }) {
    return this.paymentServiceService.deductBalance(data);
  }

  @GrpcMethod('PaymentService', 'Refund')
  refund(data: {
    paymentId: string;
    bookingId: string;
    idempotencyKey: string;
  }) {
    return this.paymentServiceService.refund(data);
  }

  @GrpcMethod('PaymentService', 'GetTransactionHistory')
  getTransactionHistory(data: {
    userId: string;
    page?: number;
    limit?: number;
  }) {
    return this.paymentServiceService.getTransactionHistory(data);
  }
}
