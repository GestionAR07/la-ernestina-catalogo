"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductImageFallback } from "@/components/catalog/ProductImageFallback";
import { getPresentationPrice, type Product } from "@/types/product";
import { formatPrice } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onAdd: (productId: string, presentation: string, quantity: number) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const selectId = useId();
  const qtyId = useId();
  const [presentation, setPresentation] = useState(product.presentations[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);

  const outOfStock = product.stockStatus === "Sin stock";
  const canAdd = !outOfStock && presentation.length > 0;
  const hasRealImage = Boolean(product.imageUrl) && !imageFailed;
  const brand = product.brand?.trim();

  const unitPrice = useMemo(
    () => getPresentationPrice(product, presentation),
    [product, presentation]
  );

  const decrease = () => {
    if (outOfStock) return;
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    if (outOfStock) return;
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-panel border border-[var(--border)] bg-surface shadow-soft"
      aria-label={product.name}
      data-product-id={product.id}
    >
      <div className="relative aspect-[16/7] border-b border-[var(--border)] sm:aspect-[2/1]">
        {hasRealImage ? (
          <Image
            src={product.imageUrl!}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ProductImageFallback
            productName={product.name}
            category={product.category}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {product.isPopular ? (
            <span className="rounded-control bg-[var(--accent)]/20 px-2 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
              Más pedido
            </span>
          ) : null}
          {outOfStock ? (
            <span className="rounded-control bg-[var(--border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
              Sin stock
            </span>
          ) : product.stockStatus === "Consultar" ? (
            <span className="rounded-control bg-[var(--accent)]/15 px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
              Consultar
            </span>
          ) : null}
          {brand ? (
            <span className="text-[11px] font-medium tracking-wide text-[var(--text-secondary)] uppercase">
              {brand}
            </span>
          ) : null}
        </div>

        <h3 className="text-base font-semibold leading-snug text-[var(--text-primary)] sm:text-lg">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {product.description}
        </p>

        <p
          className="mt-3 text-xl font-bold tracking-tight text-[var(--text-primary)]"
          data-testid="product-unit-price"
        >
          {formatPrice(unitPrice)}
        </p>

        <div className="mt-3 flex flex-1 flex-col justify-end gap-2.5">
          {outOfStock ? (
            product.presentations.length > 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                Presentación:{" "}
                <span className="text-[var(--text-primary)]">
                  {product.presentations.join(" · ")}
                </span>
              </p>
            ) : null
          ) : product.presentations.length > 1 ? (
            <div className="flex min-h-11 items-center gap-2">
              <label
                htmlFor={selectId}
                className="shrink-0 text-sm text-[var(--text-secondary)]"
              >
                Presentación
              </label>
              <select
                id={selectId}
                value={presentation}
                onChange={(event) => setPresentation(event.target.value)}
                className="min-h-11 min-w-0 flex-1 rounded-control border border-[var(--border)] bg-[var(--background)] px-2.5 text-sm text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
                data-testid="presentation-select"
              >
                {product.presentations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              Presentación:{" "}
              <span className="text-[var(--text-primary)]">{presentation}</span>
            </p>
          )}

          {outOfStock ? (
            <Button
              className="w-full disabled:border disabled:border-[var(--border)] disabled:bg-[var(--background)] disabled:text-[var(--text-secondary)] disabled:opacity-100"
              disabled
              aria-disabled="true"
              data-testid="add-to-order"
            >
              Sin stock
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor={qtyId} className="sr-only">
                  Cantidad de {product.name}
                </label>
                <button
                  type="button"
                  onClick={decrease}
                  disabled={quantity <= 1}
                  aria-label={`Disminuir cantidad de ${product.name}`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] motion-safe-transition hover:bg-surface-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <input
                  id={qtyId}
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (!Number.isFinite(next)) return;
                    setQuantity(Math.min(99, Math.max(1, Math.trunc(next))));
                  }}
                  className="min-h-11 w-12 rounded-control border border-[var(--border)] bg-[var(--background)] text-center text-sm tabular-nums text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] sm:w-14"
                />
                <button
                  type="button"
                  onClick={increase}
                  disabled={quantity >= 99}
                  aria-label={`Aumentar cantidad de ${product.name}`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] motion-safe-transition hover:bg-surface-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <Button
                className="min-w-0 flex-1"
                disabled={!canAdd}
                data-testid="add-to-order"
                onClick={() => {
                  if (!canAdd) return;
                  onAdd(product.id, presentation, quantity);
                  setQuantity(1);
                }}
              >
                Agregar
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
