import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

type AuthRequest = {
  user: {
    id: string;
    email: string;
  };
};

type VerifyPaymentBody = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findMyOrders(@Req() req: AuthRequest) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Get(':orderId')
  findOneMyOrder(@Req() req: AuthRequest, @Param('orderId') orderId: string) {
    return this.ordersService.findOneMyOrder(req.user.id, orderId);
  }

  @Post()
  createOrderFromCart(
    @Req() req: AuthRequest,
    @Body('addressId') addressId: string,
  ) {
    return this.ordersService.createOrderFromCart(req.user.id, { addressId });
  }

  @Post('verify-payment')
  verifyPayment(@Req() req: AuthRequest, @Body() body: VerifyPaymentBody) {
    return this.ordersService.verifyRazorpayPayment(req.user.id, body);
  }
}
