export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  imageUrl?: string;
  presentations: string[];
  /** Precio por defecto cuando no hay mapa por presentación. */
  price?: number;
  /** Precio unitario por etiqueta de presentación (prioridad sobre `price`). */
  pricesByPresentation?: Record<string, number>;
  stockStatus: "Disponible" | "Consultar" | "Sin stock";
  isFeatured?: boolean;
  isPopular?: boolean;
}

export function getPresentationPrice(
  product: Product,
  presentation: string
): number | undefined {
  const mapped = product.pricesByPresentation?.[presentation];
  if (typeof mapped === "number" && Number.isFinite(mapped)) {
    return mapped;
  }
  if (typeof product.price === "number" && Number.isFinite(product.price)) {
    return product.price;
  }
  return undefined;
}
