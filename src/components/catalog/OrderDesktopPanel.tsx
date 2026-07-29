"use client";

import { useOrder } from "@/providers/OrderProvider";
import { OrderSummary } from "@/components/catalog/OrderSummary";
import { formatUnitCount } from "@/utils/format";
import { getOrderTotals } from "@/utils/orderTotals";

export const ORDER_DESKTOP_PANEL_ID = "order-summary-desktop";
export const ORDER_DESKTOP_TITLE_ID = "order-summary-desktop-title";

export function OrderDesktopPanel() {
  const { order } = useOrder();
  const { totalUnits } = getOrderTotals(order);

  return (
    <aside
      id={ORDER_DESKTOP_PANEL_ID}
      tabIndex={-1}
      aria-labelledby={ORDER_DESKTOP_TITLE_ID}
      className="hidden xl:block xl:w-[22.5rem] xl:shrink-0"
    >
      <div
        className="sticky top-[calc(var(--site-header-offset)+1rem)] flex max-h-[calc(100dvh-var(--site-header-offset)-2rem)] flex-col overflow-hidden rounded-panel border border-[var(--border)] bg-surface-elevated shadow-soft outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
      >
        <div className="sr-only" aria-live="polite">
          Pedido: {totalUnits === 0 ? "vacío" : formatUnitCount(totalUnits)}
        </div>
        <OrderSummary
          variant="desktop"
          titleId={ORDER_DESKTOP_TITLE_ID}
          className="min-h-0"
        />
      </div>
    </aside>
  );
}
