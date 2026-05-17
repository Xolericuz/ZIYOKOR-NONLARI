import { Injectable, NotFoundException } from '@nestjs/common';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  bakeryId: string;
  bakeryName: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const orders: Order[] = [];

@Injectable()
export class OrderService {
  create(dto: any): Order {
    const order: Order = {
      id: `order-${Date.now()}`,
      customerId: dto.customerId,
      customerName: dto.customerName || '',
      bakeryId: dto.bakeryId,
      bakeryName: dto.bakeryName || '',
      items: dto.items || [],
      totalAmount: dto.totalAmount || 0,
      status: 'pending',
      deliveryAddress: dto.deliveryAddress || '',
      phone: dto.phone || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    orders.push(order);
    return order;
  }

  findAll(): Order[] {
    return orders;
  }

  findOne(id: string): Order {
    const order = orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  findByCustomer(customerId: string): Order[] {
    return orders.filter((o) => o.customerId === customerId);
  }

  findByBakery(bakeryId: string): Order[] {
    return orders.filter((o) => o.bakeryId === bakeryId);
  }

  updateStatus(id: string, status: string): Order {
    const order = this.findOne(id);
    order.status = status;
    order.updatedAt = new Date();
    return order;
  }
}
