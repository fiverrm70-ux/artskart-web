import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';

type AuthRequest = {
  user: {
    id: string;
    email: string;
  };
};

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findMyCart(@Req() req: AuthRequest) {
    return this.cartService.findMyCart(req.user.id);
  }

  @Post()
  addToCart(
    @Req() req: AuthRequest,
    @Body('productId') productId: string,
    @Body('quantity') quantity?: number,
  ) {
    return this.cartService.addToCart(req.user.id, productId, quantity);
  }

  @Patch(':productId')
  updateCartItem(
    @Req() req: AuthRequest,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateCartItem(req.user.id, productId, quantity);
  }

  @Delete(':productId')
  removeFromCart(
    @Req() req: AuthRequest,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Delete()
  clearCart(@Req() req: AuthRequest) {
    return this.cartService.clearCart(req.user.id);
  }
}
