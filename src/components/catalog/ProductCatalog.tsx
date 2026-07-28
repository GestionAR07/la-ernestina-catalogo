"use client";

import { useMemo, useState } from "react";
import { getCatalogProducts } from "@/data/catalog";
import { CATEGORIES } from "@/data/categories";
import { useOrder } from "@/providers/OrderProvider";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { CategoryNav, type CategoryFilter } from "@/components/catalog/CategoryNav";
import { ProductCard } from "@/components/catalog/ProductCard";
import { normalizeText } from "@/utils/normalizeText";
import type { Product } from "@/types/product";

const POPULAR_LIMIT = 6;

function productMatchesQuery(product: Product, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;

  const haystack = [
    product.name,
    product.category,
    product.description,
    product.brand ?? "",
  ]
    .map(normalizeText)
    .join(" ");

  return haystack.includes(normalizedQuery);
}

export function ProductCatalog() {
  const { addItem } = useOrder();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const catalog = useMemo(() => getCatalogProducts(), []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const category of CATEGORIES) {
      map[category] = catalog.filter((product) => product.category === category).length;
    }
    return map;
  }, [catalog]);

  const resolvedCategory: CategoryFilter =
    activeCategory !== "Todos" && (counts[activeCategory] ?? 0) === 0
      ? "Todos"
      : activeCategory;

  const popular = useMemo(
    () => catalog.filter((product) => product.isPopular === true).slice(0, POPULAR_LIMIT),
    [catalog]
  );

  const normalizedQuery = useMemo(
    () => normalizeText(searchQuery),
    [searchQuery]
  );

  const filtered = useMemo(() => {
    return catalog.filter((product) => {
      const matchesCategory =
        resolvedCategory === "Todos" || product.category === resolvedCategory;
      return matchesCategory && productMatchesQuery(product, normalizedQuery);
    });
  }, [catalog, normalizedQuery, resolvedCategory]);

  const handleAdd = (productId: string, presentation: string, quantity: number) => {
    addItem(productId, presentation, quantity);
    const product = catalog.find((item) => item.id === productId);
    setAnnouncement(
      `${product?.name ?? "Producto"} (${presentation}) x${quantity} agregado al pedido`
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("Todos");
  };

  const hasActiveFilters = normalizedQuery.length > 0 || resolvedCategory !== "Todos";

  return (
    <section
      id="catalogo"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="catalog-heading"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="catalog-heading"
            className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl"
          >
            Catálogo
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Elegí categoría, presentación y cantidad para armar tu pedido.
          </p>
        </div>
        <CatalogSearch
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filtered.length}
        />
      </div>

      <CategoryNav
        active={resolvedCategory}
        onChange={setActiveCategory}
        counts={counts}
      />

      {popular.length > 0 ? (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
            Los más pedidos
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((product) => (
              <ProductCard
                key={`popular-${product.id}`}
                product={product}
                onAdd={handleAdd}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
          {resolvedCategory === "Todos" ? "Todos los productos" : resolvedCategory}
        </h3>

        {filtered.length === 0 ? (
          <div className="rounded-panel border border-[var(--border)] bg-surface px-4 py-8 text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              No encontramos productos con esos filtros.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Probá otra búsqueda o volvé a ver todo el catálogo.
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-white shadow-soft motion-safe-transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
              >
                Limpiar búsqueda y categoría
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </section>
  );
}
