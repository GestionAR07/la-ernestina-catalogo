import { PRODUCTS } from "@/data/products";
import { QA_FIXTURE_PRODUCTS } from "@/data/qaFixtures";
import type { Product } from "@/types/product";

export function areQaFixturesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_QA_FIXTURES === "true";
}

/** Catálogo efectivo para UI y cálculos. */
export function getCatalogProducts(): Product[] {
  if (areQaFixturesEnabled()) {
    return [...PRODUCTS, ...QA_FIXTURE_PRODUCTS];
  }
  return PRODUCTS;
}
