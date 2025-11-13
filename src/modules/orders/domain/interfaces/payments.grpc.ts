export interface PaymentsGrpcService {
  processPayment(data: {
    orderId: number;
    amount: number;
    userId: number;
  }): Promise<{
    paymentId: string;
    status: 'APPROVED' | 'REJECTED';
  }>;
}
