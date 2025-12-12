export enum OrderStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  total_orders: number;
  total_items: number;
  total_sum: number;
  orders: Order[];
}
