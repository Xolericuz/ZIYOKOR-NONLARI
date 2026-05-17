import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  create(@Body() dto: any) {
    return this.paymentService.create(dto);
  }

  @Post('click/callback')
  clickCallback(@Body() dto: any) {
    return this.paymentService.clickCallback(dto);
  }

  @Post('payme/callback')
  paymeCallback(@Body() dto: any) {
    return this.paymentService.paymeCallback(dto);
  }
}
