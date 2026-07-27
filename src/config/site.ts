/**
 * Configuración comercial centralizada de La Ernestina.
 * Completar únicamente con datos reales del comercio.
 * No inventar WhatsApp, teléfono, dirección, horarios ni medios de pago.
 */

export const SITE_NAME = "La Ernestina";
export const SITE_DESCRIPTION = "Forrajería & Alimentos";

/**
 * Número de WhatsApp en formato internacional solo dígitos (sin +, espacios ni guiones).
 * Placeholder deliberado: el checkout permanece bloqueado hasta reemplazarlo.
 */
export const WHATSAPP_NUMBER = "5490000000000";

/** Etiquetas profesionales mientras faltan datos reales. */
export const PENDING = {
  phone: "Teléfono pendiente de configurar",
  address: "Dirección del comercio pendiente de configurar",
  hours: "Horarios pendientes de configurar",
  whatsapp: "WhatsApp pendiente de configurar",
} as const;

export const PHONE = PENDING.phone;
export const ADDRESS = PENDING.address;
export const HOURS = PENDING.hours;

/**
 * Modalidades de pedido disponibles en el drawer.
 * No incluyen detalle de zonas/costos de envío (aún no informados).
 */
export const DELIVERY_OPTIONS = ["Retiro", "Consultar envío"] as const;

/** Enlaces sociales — vacío hasta recibir URLs reales. */
export const SOCIALS = {} as const;

/** Medios de pago visibles — vacío hasta confirmación del comercio. */
export const PAYMENT_METHODS: readonly string[] = [];

export const COMMERCIAL_STATUS = {
  whatsappReady: false,
  phoneReady: false,
  addressReady: false,
  hoursReady: false,
  paymentMethodsReady: false,
} as const;
