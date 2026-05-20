export interface Category {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  image_url?: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  price: number;
  compare_price?: number;
  discount_percentage?: number;
  image_url: string;
  images: string[];
  category_id: string;
  category?: Category;
  unit: string;
  min_order?: number;
  stock: number;
  is_featured: boolean;
  is_offer: boolean;
  offer_end_date?: string;
  is_available: boolean;
  rating: number;
  rating_count: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_location: DeliveryLocation;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

export type PaymentMethod = "cash" | "card" | "pickup";
export type OrderStatus = "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

export interface Offer {
  id: string;
  title: string;
  description?: string;
  discount_percentage: number;
  image_url: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_customers: number;
  pending_orders: number;
  low_stock_products: number;
  orders_by_status: { status: string; count: number }[];
  revenue_by_month: { month: string; revenue: number }[];
  recent_orders: Order[];
}
