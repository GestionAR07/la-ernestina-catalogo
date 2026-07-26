"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";
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
  const outOfStock = product.stockStatus === "Sin stock";
  const canAdd = !outOfStock && presentation.length > 0;

  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increase = () => setQuantity((prev) => Math.min(99, prev + 1));

  return (
    <article className="flex h-full flex-col rounded border border-[var(--border)] bg-surface p-4 sm:p-5">
      <div
        className="mb-4 flex h-28 items-center justify-center rounded bg-[var(--background)]"
        aria-hidden="true"
      >
        <div className="h-12 w-12 rounded-full border border-[var(--border)] bg-[var(--surface)]" />
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
          {product.brand}
        </span>
        <span
          className={`rounded px-2 py-0.5 text-xs ${
            product.stockStatus === "Disponible"
              ? "bg-[var(--primary)]/20 text-[var(--primary-soft)]"
              : product.stockStatus === "Consultar"
                ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                : "bg-[var(--border)] text-[var(--text-secondary)]"
          }`}
        >
          {product.stockStatus}
        </span>
      </div>

      <h3 className="text-lg font-semibold leading-snug text-[var(--text-primary)]">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
        {product.description}
      </p>

      <p className="mt-4 text-base font-semibold text-[var(--text-primary)]">
        {formatPrice(product.price)}
      </p>

      <div className="mt-4 space-y-3">
        {product.presentations.length > 1 ? (
          <div>
            <label htmlFor={selectId} className="mb-1 block text-sm text-[var(--text-secondary)]">
              Presentación
            </label>
            <select
              id={selectId}
              value={presentation}
              onChange={(event) => setPresentation(event.target.value)}
              className="min-h-11 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)]"
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

        <div>
          <label htmlFor={qtyId} className="mb-1 block text-sm text-[var(--text-secondary)]">
            Cantidad
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrease}
              disabled={quantity <= 1}
              aria-label={`Disminuir cantidad de ${product.name}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[var(--border)] bg-[var(--background)] disabled:opacity-40"
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
              className="min-h-11 w-16 rounded border border-[var(--border)] bg-[var(--background)] text-center text-sm text-[var(--text-primary)]"
            />
            <button
              type="button"
              onClick={increase}
              disabled={quantity >= 99}
              aria-label={`Aumentar cantidad de ${product.name}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[var(--border)] bg-[var(--background)] disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!canAdd}
          onClick={() => {
            if (!canAdd) return;
            onAdd(product.id, presentation, quantity);
            setQuantity(1);
          }}
        >
          {outOfStock ? "Sin stock" : "Agregar al pedido"}
        </Button>
      </div>
    </article>
  );
}
