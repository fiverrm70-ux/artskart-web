import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

type AuthRequest = {
  user: {
    id: string;
    email: string;
  };
};

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findMyWishlist(@Req() req: AuthRequest) {
    return this.wishlistService.findMyWishlist(req.user.id);
  }

  @Post()
  addToWishlist(@Req() req: AuthRequest, @Body('productId') productId: string) {
    return this.wishlistService.addToWishlist(req.user.id, productId);
  }

  @Delete(':productId')
  removeFromWishlist(
    @Req() req: AuthRequest,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(req.user.id, productId);
  }
}
