import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import Razorpay from 'razorpay';
import { createHmac } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';

type CreateOrderPayload = {
  addressId: string;
};

type VerifyPaymentPayload = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

@Injectable()
export class OrdersService {
  private razorpay: Razorpay;

  constructor(private readonly prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneMyOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createOrderFromCart(userId: string, payload: CreateOrderPayload) {
    const address = await this.prisma.address.findFirst({
      where: {
        id: payload.addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    for (const item of cartItems) {
      if (!item.product.isActive) {
        throw new BadRequestException(`${item.product.title} is not available`);
      }

      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `${item.product.title} does not have enough stock`,
        );
      }
    }

    const subtotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    const shippingFee = 0;
    const taxAmount = 0;
    const totalAmount = subtotal + shippingFee + taxAmount;

    const orderNumber = `AK-${Date.now()}`;

    const shippingAddress = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(', ');

    const inrRate = Number(process.env.RAZORPAY_INR_RATE || 94.5);
    const razorpayAmountInr = Math.round(totalAmount * inrRate);

    const razorpayOrder = await this.razorpay.orders.create({
      amount: razorpayAmountInr * 100,
      currency: 'INR',
      receipt: orderNumber,
    });

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: address.id,

          subtotal,
          shippingFee,
          taxAmount,

          totalAmount: razorpayAmountInr,
          currency: 'INR',

          razorpayOrderId: razorpayOrder.id,

          customerName: address.fullName,
          customerEmail: address.email || '',
          customerPhone: address.phone,
          shippingAddress,

          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productTitle: item.product.title,
              productImage: item.product.imageUrl,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: item.product.price * item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return {
        ...order,
        razorpayKey: process.env.RAZORPAY_KEY_ID,
      };
    });
  }

  async verifyRazorpayPayment(userId: string, payload: VerifyPaymentPayload) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: payload.orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.razorpayOrderId) {
      throw new BadRequestException('Razorpay order ID missing');
    }

    if (order.razorpayOrderId !== payload.razorpayOrderId) {
      throw new BadRequestException('Razorpay order mismatch');
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new BadRequestException('Razorpay secret missing');
    }

    const expectedSignature = createHmac('sha256', secret)
      .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== payload.razorpaySignature) {
      throw new BadRequestException('Invalid Razorpay signature');
    }

    if (order.paymentStatus === 'PAID') {
      return order;
    }

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          userId,
        },
      });

      return tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: 'PAID',
          razorpayPaymentId: payload.razorpayPaymentId,
          razorpaySignature: payload.razorpaySignature,
        },
        include: {
          items: true,
        },
      });
    });
  }
}
