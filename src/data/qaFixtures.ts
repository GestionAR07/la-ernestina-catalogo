import type { Product } from "@/types/product";

/**
 * Fixtures de QA — solo se incluyen si NEXT_PUBLIC_ENABLE_QA_FIXTURES=true.
 * No representan mercadería real y no deben publicarse en producción.
 */
export const QA_FIXTURE_PRODUCTS: Product[] = [
  {
    id: "qa-multi-1",
    name: "[QA] Producto multi-presentación",
    description:
      "Producto temporal de prueba con dos presentaciones y precios distintos. No representa mercadería real.",
    category: "Ofertas",
    presentations: ["bolsa de 5 kg", "bolsa de 15 kg"],
    pricesByPresentation: {
      "bolsa de 5 kg": 800,
      "bolsa de 15 kg": 2100,
    },
    stockStatus: "Disponible",
    isPopular: false,
  },
];
