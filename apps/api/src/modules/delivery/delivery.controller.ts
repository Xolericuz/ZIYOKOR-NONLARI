import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('assign')
  assign(@Body() dto: any) {
    return this.deliveryService.assign(dto);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.deliveryService.complete(id);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId') driverId: string) {
    return this.deliveryService.findByDriver(driverId);
  }
}
