import { api } from './api';

export type ApiOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  userId: string;
  addressId?: string | null;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
};

export type RazorpayOrderResponse = ApiOrder & {
  razorpayKey?: string;
};

export type VerifyRazorpayPaymentPayload = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export async function createOrder(addressId: string) {
  const response = await api.post<RazorpayOrderResponse>('/orders', {
    addressId,
  });

  return response.data;
}

export async function verifyRazorpayPayment(
  payload: VerifyRazorpayPaymentPayload,
) {
  const response = await api.post<ApiOrder>('/orders/verify-payment', payload);

  return response.data;
}

export async function getMyOrders() {
  const response = await api.get<ApiOrder[]>('/orders');
  return response.data;
}

export async function getMyOrder(orderId: string) {
  const response = await api.get<ApiOrder>(`/orders/${orderId}`);
  return response.data;
}
