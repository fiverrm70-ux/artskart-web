import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        productId: dto.productId,
        rating: dto.rating,
        review: dto.review,
        name: dto.name,
        city: dto.city,
        country: dto.country,
        email: dto.email,
        mediaUrls: dto.mediaUrls ?? [],
        status: ReviewStatus.PENDING,
      },
    });
  }

  getApprovedByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: {
        productId,
        status: ReviewStatus.APPROVED,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getAdminReviews(status?: ReviewStatus) {
    return this.prisma.review.findMany({
      where: status ? { status } : undefined,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async approve(id: string) {
    await this.ensureReview(id);

    return this.prisma.review.update({
      where: { id },
      data: { status: ReviewStatus.APPROVED },
    });
  }

  async reject(id: string) {
    await this.ensureReview(id);

    return this.prisma.review.update({
      where: { id },
      data: { status: ReviewStatus.REJECTED },
    });
  }

  private async ensureReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }
}
