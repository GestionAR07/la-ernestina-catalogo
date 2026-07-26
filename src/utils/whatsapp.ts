import { PRODUCTS } from "@/data/products";
import { WHATSAPP_NUMBER } from "@/config/site";
import type { Order } from "@/types/order";

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

function formatPrice(price: number | undefined): string {
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return "Consultar precio";
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppMessage(order: Order): string {
  const lines: string[] = [
    "Hola, quiero hacer un pedido en La Ernestina:",
    "",
  ];

  for (const item of order.items) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const name = product?.name ?? item.productId;
    const brand = product?.brand ? ` (${product.brand})` : "";
    lines.push(
      `• ${name}${brand} — ${item.presentation} x${item.quantity} — ${formatPrice(product?.price)}`
    );
  }

  lines.push("");
  lines.push(`Modalidad: ${order.deliveryOption}`);

  const observations = order.observations?.trim();
  if (observations) {
    lines.push(`Observaciones: ${observations}`);
  }

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
