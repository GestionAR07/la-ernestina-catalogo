export interface OrderItem {
  productId: string;
  presentation: string;
  quantity: number;
}

export interface Order {
  version: number; // should be 1
  items: OrderItem[];
  observations?: string;
  deliveryOption: 'Retiro' | 'Consultar envío';
}
