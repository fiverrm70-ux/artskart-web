import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addToCart(userId: string, productId: string, quantity = 1) {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Requested quantity exceeds stock');
    }

    return this.prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Requested quantity exceeds stock');
    }

    return this.prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async removeFromCart(userId: string, productId: string) {
    await this.prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return {
      message: 'Removed from cart',
    };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    });

    return {
      message: 'Cart cleared',
    };
  }
}
