import { PRODUCTS } from "@/data/products";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/product";

export function findProduct(productId: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === productId);
}

export function getUnitPrice(item: OrderItem): number | undefined {
  return findProduct(item.productId)?.price;
}

export function getLineSubtotal(item: OrderItem): number | undefined {
  const unit = getUnitPrice(item);
  if (typeof unit !== "number") return undefined;
  return unit * item.quantity;
}

export function getOrderTotals(order: Order): {
  knownSubtotal: number;
  hasUnknownPrices: boolean;
  totalUnits: number;
} {
  let knownSubtotal = 0;
  let hasUnknownPrices = false;
  let totalUnits = 0;

  for (const item of order.items) {
    totalUnits += item.quantity;
    const subtotal = getLineSubtotal(item);
    if (typeof subtotal === "number") {
      knownSubtotal += subtotal;
    } else {
      hasUnknownPrices = true;
    }
  }

  return { knownSubtotal, hasUnknownPrices, totalUnits };
}
