import { Injectable, NotFoundException } from '@nestjs/common';

interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  driverName: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  assignedAt: Date;
  completedAt?: Date;
}

const deliveries: Delivery[] = [];

@Injectable()
export class DeliveryService {
  assign(dto: any): Delivery {
    const delivery: Delivery = {
      id: `delivery-${Date.now()}`,
      orderId: dto.orderId,
      driverId: dto.driverId,
      driverName: dto.driverName || '',
      status: 'assigned',
      pickupAddress: dto.pickupAddress || '',
      deliveryAddress: dto.deliveryAddress || '',
      assignedAt: new Date(),
    };
    deliveries.push(delivery);
    return delivery;
  }

  complete(id: string): Delivery {
    const delivery = deliveries.find((d) => d.id === id);
    if (!delivery) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
    delivery.status = 'completed';
    delivery.completedAt = new Date();
    return delivery;
  }

  findByDriver(driverId: string): Delivery[] {
    return deliveries.filter((d) => d.driverId === driverId);
  }
}
