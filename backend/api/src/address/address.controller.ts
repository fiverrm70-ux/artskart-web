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
import { AddressService } from './address.service';

type AuthRequest = {
  user: {
    id: string;
    email: string;
  };
};

@Controller('address')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  findMyAddresses(@Req() req: AuthRequest) {
    return this.addressService.findMyAddresses(req.user.id);
  }

  @Post()
  createAddress(@Req() req: AuthRequest, @Body() body: any) {
    return this.addressService.createAddress(req.user.id, body);
  }

  @Patch(':addressId')
  updateAddress(
    @Req() req: AuthRequest,
    @Param('addressId') addressId: string,
    @Body() body: any,
  ) {
    return this.addressService.updateAddress(req.user.id, addressId, body);
  }

  @Delete(':addressId')
  deleteAddress(
    @Req() req: AuthRequest,
    @Param('addressId') addressId: string,
  ) {
    return this.addressService.deleteAddress(req.user.id, addressId);
  }
}
