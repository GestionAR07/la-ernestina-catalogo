"use client";

import { useId, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DELIVERY_OPTIONS } from "@/config/site";
import { useOrder } from "@/providers/OrderProvider";
import { formatPrice, formatUnitCount } from "@/utils/format";
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

export type OrderSummaryVariant = "desktop" | "sheet";

interface OrderSummaryProps {
  variant: OrderSummaryVariant;
  /** Called when user chooses “Ver productos” (e.g. close sheet). */
  onBrowseCatalog?: () => void;
  /** Reset inline “vaciar” confirm when sheet closes. */
  resetToken?: string | number | boolean;
  className?: string;
  /** Hide the top title block when the shell already shows one (sheet header). */
  hideTitle?: boolean;
  titleId?: string;
}

export function OrderSummary({
  variant,
  onBrowseCatalog,
  resetToken,
  className = "",
  hideTitle = false,
  titleId,
}: OrderSummaryProps) {
  const uid = useId();
  const idPrefix = `${variant}-${uid}`;
  const deliveryId = `${idPrefix}-delivery`;
  const notesId = `${idPrefix}-notes`;
  const whatsappHelpId = `${idPrefix}-whatsapp-help`;
  const resolvedTitleId = titleId ?? `${idPrefix}-title`;

  const {
    order,
    updateQuantity,
    updatePresentation,
    removeItem,
    clearOrder,
    setDeliveryOption,
    setObservations,
  } = useOrder();

  const { knownSubtotal, hasUnknownPrices, totalUnits } = getOrderTotals(order);
  const whatsappReady = isWhatsAppConfigured();
  const isEmpty = order.items.length === 0;

  const clearFingerprint = `${order.items
    .map((item) => `${item.productId}:${item.presentation}:${item.quantity}`)
    .join("|")}|${order.deliveryOption}|${order.observations ?? ""}|${String(resetToken)}`;
  const [confirmFor, setConfirmFor] = useState<string | null>(null);
  const confirmClear = confirmFor === clearFingerprint;

  const browseCatalog = () => {
    onBrowseCatalog?.();
    const target = document.getElementById("catalogo");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.requestAnimationFrame(() => {
      document.getElementById("catalog-heading")?.focus({ preventScroll: true });
    });
  };

  const onWhatsAppClick = () => {
    if (!whatsappReady || isEmpty) return;
    openWhatsAppOrder(order);
  };

  const unitsLabel =
    totalUnits === 0 ? "Sin productos" : formatUnitCount(totalUnits);

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col ${className}`}
      data-order-summary={variant}
    >
      {!hideTitle ? (
        <div className="shrink-0 border-b border-[var(--border)] px-4 py-4">
          <h2
            id={resolvedTitleId}
            className="text-lg font-semibold text-[var(--text-primary)]"
          >
            Tu pedido
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{unitsLabel}</p>
        </div>
      ) : null}

      <div
        className={`min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 ${
          variant === "desktop" ? "overscroll-contain" : ""
        }`}
      >
        {isEmpty ? (
          <div className="rounded-panel border border-dashed border-[var(--border)] bg-[var(--background)]/50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Todavía no agregaste productos.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Elegí productos del catálogo para preparar tu pedido.
            </p>
            <a
              href="#catalogo"
              onClick={(event) => {
                event.preventDefault();
                browseCatalog();
              }}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-white shadow-soft motion-safe-transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
            >
              Ver productos
            </a>
          </div>
        ) : (
          <ul className="space-y-3">
            {order.items.map((item) => {
              const product = findProduct(item.productId);
              const name = product?.name ?? item.productId;
              const unitPrice = getUnitPrice(item);
              const subtotal = getLineSubtotal(item);
              const presentations = product?.presentations ?? [item.presentation];
              const canChangePresentation = presentations.length > 1;
              const lineKey = `${item.productId}::${item.presentation}`;
              const presentationSelectId = `${idPrefix}-pres-${item.productId}-${item.presentation.replace(/\s+/g, "-")}`;

              return (
                <li
                  key={lineKey}
                  className="rounded-panel border border-[var(--border)] bg-[var(--background)] p-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug text-[var(--text-primary)]">
                        {name}
                      </p>
                      {canChangePresentation ? (
                        <div className="mt-2">
                          <label
                            htmlFor={presentationSelectId}
                            className="mb-1 block text-xs text-[var(--text-secondary)]"
                          >
                            Presentación
                          </label>
                          <select
                            id={presentationSelectId}
                            value={item.presentation}
                            onChange={(event) =>
                              updatePresentation(
                                item.productId,
                                item.presentation,
                                event.target.value
                              )
                            }
                            className="min-h-11 w-full rounded-control border border-[var(--border)] bg-surface px-2.5 text-sm text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
                          >
                            {presentations.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {item.presentation}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-[var(--text-secondary)]">
                        Unitario: {formatPrice(unitPrice)}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Subtotal: {formatPrice(subtotal)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.presentation)}
                      aria-label={`Eliminar ${name} (${item.presentation})`}
                      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-control text-[var(--text-secondary)] motion-safe-transition hover:bg-surface-elevated hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
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
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-[var(--border)] bg-surface disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span
                      className="min-w-10 text-center text-sm font-medium tabular-nums text-[var(--text-primary)]"
                      aria-live="polite"
                    >
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
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-[var(--border)] bg-surface disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor={deliveryId}
              className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]"
            >
              Modalidad
            </label>
            <select
              id={deliveryId}
              value={order.deliveryOption}
              onChange={(event) =>
                setDeliveryOption(
                  event.target.value as (typeof DELIVERY_OPTIONS)[number]
                )
              }
              className="min-h-11 w-full rounded-control border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
            >
              {DELIVERY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={notesId}
              className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]"
            >
              Observaciones
            </label>
            <textarea
              id={notesId}
              rows={variant === "desktop" ? 3 : 2}
              value={order.observations ?? ""}
              onChange={(event) => setObservations(event.target.value)}
              placeholder="Opcional"
              className="min-h-[4.5rem] w-full resize-y rounded-control border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 space-y-3 border-t border-[var(--border)] px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {hasUnknownPrices ? (
              <>
                <p className="text-sm text-[var(--text-secondary)]">Subtotal conocido</p>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  {formatPrice(knownSubtotal)}
                </p>
                <p className="mt-1 text-xs text-[var(--accent)]">
                  El total final puede variar
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Hay productos cuyo precio debe consultarse
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-[var(--text-secondary)]">Total estimado</p>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  {formatPrice(knownSubtotal)}
                </p>
              </>
            )}
          </div>

          {!confirmClear ? (
            <Button
              variant="outline"
              onClick={() => setConfirmFor(clearFingerprint)}
              disabled={isEmpty}
              className="shrink-0"
            >
              Vaciar
            </Button>
          ) : (
            <div
              className="flex max-w-[12rem] flex-col items-end gap-2"
              role="group"
              aria-label="Confirmar vaciar pedido"
            >
              <p className="text-right text-xs font-medium text-[var(--text-primary)]">
                ¿Vaciar pedido?
              </p>
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmFor(null)}
                  className="!min-w-0 px-3 text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    clearOrder();
                    setConfirmFor(null);
                  }}
                  className="!min-w-0 px-3 text-sm"
                >
                  Sí, vaciar
                </Button>
              </div>
            </div>
          )}
        </div>

        {whatsappReady ? (
          <>
            <Button
              className="w-full"
              disabled={isEmpty}
              onClick={onWhatsAppClick}
              aria-describedby={whatsappHelpId}
            >
              Continuar por WhatsApp
            </Button>
            <p
              id={whatsappHelpId}
              className="text-xs leading-relaxed text-[var(--text-secondary)]"
            >
              Se abrirá WhatsApp con el detalle de tu pedido.
            </p>
          </>
        ) : (
          <div
            role="status"
            className="rounded-panel border border-[var(--border)] bg-[var(--background)] px-3 py-3"
          >
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Podés armar y guardar tu pedido en este dispositivo. El envío por
              WhatsApp estará disponible cuando se configure el contacto del
              comercio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
