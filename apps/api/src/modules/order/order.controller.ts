import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: any) {
    return this.orderService.create(dto);
  }

  @Get('customer/:userId')
  findByCustomer(@Param('userId') userId: string) {
    return this.orderService.findByCustomer(userId);
  }

  @Get('bakery/:bakeryId')
  findByBakery(@Param('bakeryId') bakeryId: string) {
    return this.orderService.findByBakery(bakeryId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.orderService.updateStatus(id, dto.status);
  }
}
