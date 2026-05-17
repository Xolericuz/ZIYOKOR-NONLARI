// ====== ENUMS ======
export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BAKING = 'baking',
  READY = 'ready',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
}

export enum DriverStatus {
  FREE = 'free',
  DELIVERING = 'delivering',
  OFFLINE = 'offline',
}

export enum BakeryStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  BUSY = 'busy',
}

// ====== INTERFACES ======
export interface IUser {
  id: number;
  role: UserRole;
  name: string;
  phone: string;
  avatarUrl?: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
}

export interface IBakery {
  id: number;
  sellerId: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  status: BakeryStatus;
  rating: number;
  totalOrders: number;
  imageUrl?: string;
  openTime: string;
  closeTime: string;
}

export interface IProduct {
  id: number;
  bakeryId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

export interface IOrder {
  id: number;
  customerId: number;
  bakeryId: number;
  driverId?: number;
  status: OrderStatus;
  total: number;
  address: string;
  lat?: number;
  lng?: number;
  note?: string;
  paymentMethod?: string;
  items: IOrderItem[];
  createdAt: Date;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface IDelivery {
  id: number;
  orderId: number;
  driverId: number;
  status: string;
  pickedAt?: Date;
  deliveredAt?: Date;
  rating?: number;
}

export interface IDriverLocation {
  driverId: number;
  lat: number;
  lng: number;
  loggedAt: Date;
}

export interface IPayment {
  id: number;
  orderId: number;
  method: string;
  amount: number;
  status: string;
  transactionId?: string;
}

export interface INotification {
  id: number;
  userId: number;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export interface IReview {
  id: number;
  userId: number;
  bakeryId: number;
  orderId: number;
  rating: number;
  comment?: string;
}

// ====== DTOs ======
export interface CreateOrderDto {
  bakeryId: number;
  items: { productId: number; quantity: number }[];
  address: string;
  lat?: number;
  lng?: number;
  note?: string;
  paymentMethod?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  driverId?: number;
}

export interface LocationUpdateDto {
  lat: number;
  lng: number;
}

export interface RegisterDto {
  name: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface LoginDto {
  phone: string;
  password: string;
}

// ====== SOCKET EVENTS ======
export const SOCKET_EVENTS = {
  // Customer → Server
  CUSTOMER_NEW_ORDER: 'customer:new-order',
  CUSTOMER_CANCEL_ORDER: 'customer:cancel-order',
  CUSTOMER_TRACK_ORDER: 'customer:track-order',

  // Seller → Server
  SELLER_ACCEPT_ORDER: 'seller:accept-order',
  SELLER_REJECT_ORDER: 'seller:reject-order',
  SELLER_UPDATE_STATUS: 'seller:update-status',
  SELLER_ASSIGN_DRIVER: 'seller:assign-driver',

  // Driver → Server
  DRIVER_LOCATION: 'driver:location',
  DRIVER_ACCEPT_DELIVERY: 'driver:accept-delivery',
  DRIVER_COMPLETE_DELIVERY: 'driver:complete-delivery',

  // Server → Customer
  ORDER_STATUS_UPDATE: 'order:status-update',
  DRIVER_LOCATION_UPDATE: 'driver:location-update',

  // Server → Seller
  SELLER_NEW_ORDER: 'seller:new-order',
  SELLER_ORDER_UPDATE: 'seller:order-update',

  // Server → Driver
  DRIVER_NEW_TASK: 'driver:new-task',
  DRIVER_TASK_UPDATE: 'driver:task-update',

  // Server → Admin
  ADMIN_ORDER_UPDATE: 'admin:order-update',
  ADMIN_STATS_UPDATE: 'admin:stats-update',
} as const;

// ====== GPS ======
export function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const CONFIG = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://zn_user:zn_password_2026@localhost:5432/ziyokor_noni',
  REDIS_URL: process.env.REDIS_URL || 'redis://:zn_redis_2026@localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'zn_jwt_super_secret_2026',
  RATE_LIMIT: 100,
  RATE_LIMIT_WINDOW_MS: 60000,
  DRIVER_LOCATION_INTERVAL: 3000,
  ORDER_AUTO_REJECT_MS: 30000,
};
