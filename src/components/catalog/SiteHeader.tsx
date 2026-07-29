"use client";

import { forwardRef } from "react";
import { ShoppingCart } from "lucide-react";
import { SITE_DESCRIPTION, SITE_NAME, WHATSAPP_NUMBER } from "@/config/site";
import { useOrder } from "@/providers/OrderProvider";
import { getOrderTotals } from "@/utils/orderTotals";
import { isWhatsAppConfigured } from "@/utils/whatsapp";

interface SiteHeaderProps {
  onOpenOrder: () => void;
  orderOpen: boolean;
  drawerId: string;
  desktopPanelId?: string;
}

const navLinkClass =
  "inline-flex min-h-11 items-center rounded-control px-1.5 text-xs font-medium text-[var(--text-secondary)] motion-safe-transition hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] sm:px-2 sm:text-sm";

export const SiteHeader = forwardRef<HTMLButtonElement, SiteHeaderProps>(
  function SiteHeader({ onOpenOrder, orderOpen, drawerId, desktopPanelId }, ref) {
    const { order, isHydrated } = useOrder();
    const { totalUnits } = getOrderTotals(order);
    const visibleCount = isHydrated ? totalUnits : 0;
    const showWhatsApp = isWhatsAppConfigured(WHATSAPP_NUMBER);

    return (
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 shadow-header backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
          <a
            href="#inicio"
            className="min-w-0 flex-1 rounded-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] sm:flex-none"
          >
            <span className="block truncate text-sm font-bold tracking-tight text-[var(--text-primary)] sm:text-lg">
              {SITE_NAME}
            </span>
            <span className="hidden truncate text-[11px] text-[var(--text-secondary)] min-[380px]:block sm:text-xs">
              {SITE_DESCRIPTION}
            </span>
          </a>

          <nav
            aria-label="Secciones"
            className="flex shrink-0 items-center gap-0.5 sm:gap-2"
          >
            <a href="#catalogo" className={navLinkClass}>
              Productos
            </a>
            <a href="#contacto" className={navLinkClass}>
              Contacto
            </a>
            {showWhatsApp ? (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClass}
              >
                WhatsApp
              </a>
            ) : null}
          </nav>

          <button
            ref={ref}
            type="button"
            onClick={onOpenOrder}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-control bg-primary px-2.5 py-2 text-sm font-semibold text-white shadow-soft motion-safe-transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] sm:gap-2 sm:px-4"
            aria-label={
              orderOpen
                ? `Cerrar pedido, ${visibleCount} ${visibleCount === 1 ? "unidad" : "unidades"}`
                : `Pedido, ${visibleCount} ${visibleCount === 1 ? "unidad" : "unidades"}`
            }
            aria-expanded={orderOpen}
            aria-controls={[drawerId, desktopPanelId].filter(Boolean).join(" ")}
            aria-haspopup="dialog"
          >
            <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Pedido</span>
            <span
              className="inline-flex min-w-6 items-center justify-center rounded-control bg-white/15 px-1.5 py-0.5 text-xs tabular-nums"
              data-testid="order-count"
            >
              {visibleCount}
            </span>
          </button>
        </div>
      </header>
    );
  }
);
