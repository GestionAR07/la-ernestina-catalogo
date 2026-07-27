import { SITE_NAME, WHATSAPP_NUMBER } from "@/config/site";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format";
import {
  findProduct,
  getLineSubtotal,
  getOrderTotals,
  getUnitPrice,
} from "@/utils/orderTotals";

const PLACEHOLDER_NUMBERS = new Set([
  "5490000000000",
  "0000000000",
  "00000000000",
]);

export function sanitizeWhatsAppNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  if (PLACEHOLDER_NUMBERS.has(digits)) return null;
  if (/^0+$/.test(digits)) return null;
  return digits;
}

export function isWhatsAppConfigured(number: string = WHATSAPP_NUMBER): boolean {
  return sanitizeWhatsAppNumber(number) !== null;
}

export function buildWhatsAppMessage(order: Order): string {
  const lines: string[] = [
    `Hola, quiero hacer un pedido en ${SITE_NAME}:`,
    "",
  ];

  for (const item of order.items) {
    const product = findProduct(item.productId);
    const name = product?.name ?? item.productId;
    const brand = product?.brand ? ` (${product.brand})` : "";
    const unit = formatPrice(getUnitPrice(item));
    const subtotal = formatPrice(getLineSubtotal(item));
    lines.push(
      `• ${name}${brand} — ${item.presentation} x${item.quantity} — unitario ${unit} — subtotal ${subtotal}`
    );
  }

  const { knownSubtotal, hasUnknownPrices } = getOrderTotals(order);
  lines.push("");
  if (hasUnknownPrices) {
    lines.push(
      `Total parcial estimado (solo ítems con precio): ${formatPrice(knownSubtotal)}`
    );
    lines.push("Hay ítems con precio a consultar.");
  } else {
    lines.push(`Total estimado: ${formatPrice(knownSubtotal)}`);
  }

  lines.push(`Modalidad: ${order.deliveryOption}`);

  const observations = order.observations?.trim();
  if (observations) {
    lines.push(`Observaciones: ${observations}`);
  }

  lines.push("");
  lines.push("Por favor confirmen disponibilidad y el total final. Gracias.");

  return lines.join("\n");
}

export type WhatsAppOpenResult =
  | { ok: true; url: string }
  | { ok: false; reason: "empty_order" | "placeholder_number" | "invalid_number" };

/**
 * Builds a wa.me URL. Does not open a window — callers must open only on explicit user action.
 */
export function createWhatsAppOrderUrl(
  order: Order,
  number: string = WHATSAPP_NUMBER
): WhatsAppOpenResult {
  if (!order.items.length) {
    return { ok: false, reason: "empty_order" };
  }

  const digits = sanitizeWhatsAppNumber(number);
  if (!digits) {
    if (PLACEHOLDER_NUMBERS.has(number.replace(/\D/g, ""))) {
      return { ok: false, reason: "placeholder_number" };
    }
    return { ok: false, reason: "invalid_number" };
  }

  const text = buildWhatsAppMessage(order);
  const url = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  return { ok: true, url };
}

/**
 * Opens WhatsApp only after an explicit user gesture. Uses noopener,noreferrer.
 */
export function openWhatsAppOrder(
  order: Order,
  number: string = WHATSAPP_NUMBER
): WhatsAppOpenResult {
  const result = createWhatsAppOrderUrl(order, number);
  if (!result.ok) return result;

  window.open(result.url, "_blank", "noopener,noreferrer");
  return result;
}
