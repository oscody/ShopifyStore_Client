// API Types - matching the backend schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  price: string;
  salePrice: string | null;
  categoryId: string | null;
  images: string[];
  stock: number;
  minStock: number;
  status: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  price: string;
  quantity: number;
  total: string;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  status: string;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// Cart Types (frontend only)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export type ViewMode = "store" | "admin";
export type AdminSection = "dashboard" | "products" | "orders" | "inventory";
