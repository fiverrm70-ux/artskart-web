import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewStatus } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Get('product/:productId')
  getApprovedByProduct(@Param('productId') productId: string) {
    return this.reviewsService.getApprovedByProduct(productId);
  }

  @Get('admin')
  getAdminReviews(@Query('status') status?: ReviewStatus) {
    return this.reviewsService.getAdminReviews(status);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.reviewsService.reject(id);
  }
}
