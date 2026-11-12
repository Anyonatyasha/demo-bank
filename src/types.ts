export interface Coupon {
  id: string;
  title: string;
  amount: number;
}

export type OrderStatus = 'pending' | 'success' | 'failed';

export interface Order {
  orderId: string;
  couponId: string;
  title: string;
  amount: number;
  createdAt: number;
  status: OrderStatus;
  couponCode: string | null;
  webhook: Webhook | null;
}

export interface Webhook{
  result: Exclude<OrderStatus, 'pending'>;
  at: number;
}

export type PaymentStatus = 'success' | 'failed' | 'loading' | 'timeout';