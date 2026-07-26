"use client";

import { forwardRef } from "react";
import { ShoppingCart } from "lucide-react";
import { SITE_DESCRIPTION, SITE_NAME } from "@/config/site";
import { useOrder } from "@/providers/OrderProvider";
import { getOrderTotals } from "@/utils/orderTotals";

interface SiteHeaderProps {
  onOpenOrder: () => void;
}

export const SiteHeader = forwardRef<HTMLButtonElement, SiteHeaderProps>(
  function SiteHeader({ onOpenOrder }, ref) {
    const { order, isHydrated } = useOrder();
    const { totalUnits } = getOrderTotals(order);
    const visibleCount = isHydrated ? totalUnits : 0;

    return (
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#inicio"
            className="min-w-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
          >
            <span className="block truncate text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">
              {SITE_NAME}
            </span>
            <span className="block truncate text-xs text-[var(--text-secondary)] sm:text-sm">
              {SITE_DESCRIPTION}
            </span>
          </a>

          <button
            ref={ref}
            type="button"
            onClick={onOpenOrder}
            className="inline-flex min-h-11 items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] sm:px-4"
            aria-label={`Abrir pedido, ${visibleCount} ${visibleCount === 1 ? "unidad" : "unidades"}`}
          >
            <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Pedido</span>
            <span className="inline-flex min-w-6 items-center justify-center rounded bg-white/15 px-1.5 py-0.5 text-xs tabular-nums">
              {visibleCount}
            </span>
          </button>
        </div>
      </header>
    );
  }
);
