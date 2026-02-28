import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PaymentServiceService {
  async deductBalance(data: {
    userId: string;
    amount: number;
    bookingId: string;
    idempotencyKey: string;
  }) {
    // TODO: Check idempotency_key in payments table; if exists return same result.
    // Debit user balance in transaction; insert payments + transactions; return success/failure.
    throw new RpcException('Not implemented: integrate DB and idempotency');
  }

  async refund(data: {
    paymentId: string;
    bookingId: string;
    idempotencyKey: string;
  }) {
    // TODO: Idempotent refund; credit user balance; insert refund payment + transaction.
    throw new RpcException('Not implemented');
  }

  getTransactionHistory(data: { userId: string; page?: number; limit?: number }) {
    // TODO: Read replica; paginate transactions.
    return { transactions: [], total: 0 };
  }
}
