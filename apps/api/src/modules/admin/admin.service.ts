import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
  ) {}

  getStats() {
    const users = this.authService.getAllUsers();
    const orders = this.orderService.findAll();

    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      ordersByStatus: orders.reduce(
        (acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  getAllOrders() {
    return this.orderService.findAll();
  }

  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
