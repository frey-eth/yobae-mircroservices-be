import { Observable } from 'rxjs';

export interface PaymentGrpcService {
  deductBalance(data: {
    userId: string;
    amount: number;
    bookingId: string;
    idempotencyKey: string;
  }): Observable<{ success: boolean; paymentId: string; message: string }>;
  refund(data: {
    paymentId: string;
    bookingId: string;
    idempotencyKey: string;
  }): Observable<{ success: boolean; message: string }>;
  getTransactionHistory(data: {
    userId: string;
    page?: number;
    limit?: number;
  }): Observable<{ transactions: Array<{ id: string; amount: number; type: string; referenceId: string; createdAt: string }>; total: number }>;
}
