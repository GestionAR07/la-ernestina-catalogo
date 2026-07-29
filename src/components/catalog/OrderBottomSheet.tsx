"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import { X } from "lucide-react";
import { OrderSummary } from "@/components/catalog/OrderSummary";
import { useOrder } from "@/providers/OrderProvider";
import { formatUnitCount } from "@/utils/format";
import { getOrderTotals } from "@/utils/orderTotals";

interface OrderBottomSheetProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  id?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function OrderBottomSheet({
  open,
  onClose,
  returnFocusRef,
  id = "order-sheet",
}: OrderBottomSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { order } = useOrder();
  const { totalUnits } = getOrderTotals(order);

  const handleClose = useCallback(() => {
    onClose();
    window.requestAnimationFrame(() => {
      returnFocusRef.current?.focus();
    });
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, handleClose]);

  if (!open) return null;

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center xl:hidden"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 motion-safe-fade-in"
        aria-label="Cerrar pedido"
        onClick={handleClose}
      />

      <div
        id={id}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onPanelKeyDown}
        className="relative flex max-h-[88dvh] w-full flex-col rounded-t-2xl border border-[var(--border)] border-b-0 bg-surface-elevated shadow-soft motion-safe-sheet-in"
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-[var(--border)]" />
        </div>

        <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-surface-elevated px-4 py-3">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold text-[var(--text-primary)]"
            >
              Tu pedido
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {totalUnits === 0 ? "Sin productos" : formatUnitCount(totalUnits)}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            aria-label="Cerrar pedido"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <OrderSummary
          variant="sheet"
          hideTitle
          resetToken={open}
          onBrowseCatalog={handleClose}
          className="min-h-0"
        />
      </div>
    </div>
  );
}
