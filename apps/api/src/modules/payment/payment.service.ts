import { Injectable } from '@nestjs/common';

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  provider: string;
  status: string;
  createdAt: Date;
  paidAt?: Date;
}

const payments: Payment[] = [];

@Injectable()
export class PaymentService {
  create(dto: any): Payment {
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      orderId: dto.orderId,
      amount: dto.amount,
      provider: dto.provider || 'click',
      status: 'pending',
      createdAt: new Date(),
    };
    payments.push(payment);
    return payment;
  }

  clickCallback(dto: any): { success: boolean; payment: Payment } {
    const payment =
      payments.find((p) => p.id === dto.paymentId) ||
      this.create({ orderId: dto.orderId, amount: dto.amount, provider: 'click' });

    const transactionId = `click-trn-${Date.now()}`;

    payment.status = 'paid';
    payment.paidAt = new Date();

    return {
      success: true,
      payment: {
        ...payment,
        clickTransactionId: transactionId,
      } as any,
    };
  }

  paymeCallback(dto: any): { success: boolean; payment: Payment } {
    const payment =
      payments.find((p) => p.id === dto.paymentId) ||
      this.create({ orderId: dto.orderId, amount: dto.amount, provider: 'payme' });

    const transactionId = `payme-trn-${Date.now()}`;

    payment.status = 'paid';
    payment.paidAt = new Date();

    return {
      success: true,
      payment: {
        ...payment,
        paymeTransactionId: transactionId,
      } as any,
    };
  }
}
