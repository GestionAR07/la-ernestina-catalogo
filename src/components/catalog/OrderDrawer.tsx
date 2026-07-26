"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DELIVERY_OPTIONS } from "@/config/site";
import { useOrder } from "@/providers/OrderProvider";
import { formatPrice } from "@/utils/format";
import {
  findProduct,
  getLineSubtotal,
  getOrderTotals,
  getUnitPrice,
} from "@/utils/orderTotals";
import {
  isWhatsAppConfigured,
  openWhatsAppOrder,
} from "@/utils/whatsapp";

interface OrderDrawerProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
  id?: string;
  titleId?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function OrderDrawer({
  open,
  onClose,
  returnFocusRef,
  id,
  titleId: titleIdProp,
}: OrderDrawerProps) {
  const generatedTitleId = useId();
  const titleId = titleIdProp ?? generatedTitleId;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const {
    order,
    updateQuantity,
    removeItem,
    clearOrder,
    setDeliveryOption,
    setObservations,
  } = useOrder();

  const { knownSubtotal, hasUnknownPrices, totalUnits } = getOrderTotals(order);
  const whatsappReady = isWhatsAppConfigured();
  const isEmpty = order.items.length === 0;

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

  const confirmClear = () => {
    if (isEmpty) return;
    const confirmed = window.confirm("¿Vaciar todo el pedido?");
    if (confirmed) clearOrder();
  };

  const onWhatsAppClick = () => {
    if (!whatsappReady || isEmpty) return;
    openWhatsAppOrder(order);
  };

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
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
        className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-surface shadow-xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-[var(--text-primary)]">
              Tu pedido
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {totalUnits === 0
                ? "Sin productos"
                : totalUnits === 1
                  ? "1 unidad"
                  : `${totalUnits} unidades`}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            aria-label="Cerrar panel de pedido"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[var(--border)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isEmpty ? (
            <p className="rounded border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              Tu pedido está vacío. Agregá productos desde el catálogo.
            </p>
          ) : (
            <ul className="space-y-4">
              {order.items.map((item) => {
                const product = findProduct(item.productId);
                const name = product?.name ?? item.productId;
                const unitPrice = getUnitPrice(item);
                const subtotal = getLineSubtotal(item);

                return (
                  <li
                    key={`${item.productId}::${item.presentation}`}
                    className="rounded border border-[var(--border)] bg-[var(--background)] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{item.presentation}</p>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          Unitario: {formatPrice(unitPrice)}
                        </p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          Subtotal: {formatPrice(subtotal)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.presentation)}
                        aria-label={`Eliminar ${name} (${item.presentation})`}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.presentation,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Disminuir ${name}`}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[var(--border)] disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="min-w-10 text-center text-sm font-medium" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.presentation,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= 99}
                        aria-label={`Aumentar ${name}`}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[var(--border)] disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="delivery-option" className="mb-1 block text-sm text-[var(--text-secondary)]">
                Modalidad
              </label>
              <select
                id="delivery-option"
                value={order.deliveryOption}
                onChange={(event) =>
                  setDeliveryOption(event.target.value as (typeof DELIVERY_OPTIONS)[number])
                }
                className="min-h-11 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)]"
              >
                {DELIVERY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="order-notes" className="mb-1 block text-sm text-[var(--text-secondary)]">
                Observaciones
              </label>
              <textarea
                id="order-notes"
                rows={3}
                value={order.observations ?? ""}
                onChange={(event) => setObservations(event.target.value)}
                placeholder="Opcional"
                className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        <footer className="space-y-3 border-t border-[var(--border)] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total estimado</p>
              <p className="text-xl font-semibold text-[var(--text-primary)]">
                {formatPrice(knownSubtotal)}
              </p>
              {hasUnknownPrices ? (
                <p className="mt-1 text-xs text-[var(--accent)]">
                  Incluye ítems con precio a consultar.
                </p>
              ) : null}
            </div>
            <Button
              variant="outline"
              onClick={confirmClear}
              disabled={isEmpty}
              className="shrink-0"
            >
              Vaciar
            </Button>
          </div>

          <Button
            className="w-full"
            disabled={isEmpty || !whatsappReady}
            onClick={onWhatsAppClick}
            aria-describedby="whatsapp-help"
          >
            Continuar por WhatsApp
          </Button>
          <p id="whatsapp-help" className="text-xs leading-relaxed text-[var(--text-secondary)]">
            {whatsappReady
              ? "Se abrirá WhatsApp con el detalle de tu pedido."
              : "WhatsApp pendiente de configurar. El envío permanece bloqueado hasta cargar el número real del comercio."}
          </p>
        </footer>
      </div>
    </div>
  );
}
