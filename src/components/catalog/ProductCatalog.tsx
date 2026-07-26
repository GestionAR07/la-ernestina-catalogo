"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { useOrder } from "@/providers/OrderProvider";
import { CategoryNav, type CategoryFilter } from "@/components/catalog/CategoryNav";
import { ProductCard } from "@/components/catalog/ProductCard";

export function ProductCatalog() {
  const { addItem } = useOrder();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Todos");
  const [announcement, setAnnouncement] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const category of CATEGORIES) {
      map[category] = PRODUCTS.filter((product) => product.category === category).length;
    }
    return map;
  }, []);

  const popular = useMemo(
    () => PRODUCTS.filter((product) => product.isPopular),
    []
  );

  const filtered = useMemo(() => {
    if (activeCategory === "Todos") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const handleAdd = (productId: string, presentation: string, quantity: number) => {
    addItem(productId, presentation, quantity);
    const product = PRODUCTS.find((item) => item.id === productId);
    setAnnouncement(
      `${product?.name ?? "Producto"} (${presentation}) x${quantity} agregado al pedido`
    );
  };

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="catalog-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="catalog-heading" className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
            Catálogo
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Elegí categoría, presentación y cantidad para armar tu pedido.
          </p>
        </div>
      </div>

      <CategoryNav
        active={activeCategory}
        onChange={setActiveCategory}
        counts={counts}
      />

      {activeCategory === "Todos" && popular.length > 0 ? (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
            Los más pedidos
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((product) => (
              <ProductCard key={`popular-${product.id}`} product={product} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
          {activeCategory === "Todos" ? "Todos los productos" : activeCategory}
        </h3>

        {filtered.length === 0 ? (
          <p className="rounded border border-[var(--border)] bg-surface px-4 py-8 text-sm text-[var(--text-secondary)]">
            No hay productos cargados en esta categoría por ahora.
          </p>
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
