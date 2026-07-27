"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Order, OrderItem } from "@/types/order";

interface OrderContextValue {
  order: Order;
  isHydrated: boolean;
  addItem: (productId: string, presentation: string, quantity?: number) => void;
  removeItem: (productId: string, presentation: string) => void;
  updateQuantity: (productId: string, presentation: string, quantity: number) => void;
  updatePresentation: (productId: string, oldPresentation: string, newPresentation: string) => void;
  clearOrder: () => void;
  setObservations: (obs: string) => void;
  setDeliveryOption: (option: Order["deliveryOption"]) => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "la-ernestina-order-v1";
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const DEFAULT_ORDER: Order = {
  version: 1,
  items: [],
  deliveryOption: "Retiro",
};

function clampQuantity(quantity: unknown): number {
  const n = typeof quantity === "number" ? quantity : Number(quantity);
  if (!Number.isFinite(n)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(n)));
}

function isDeliveryOption(value: unknown): value is Order["deliveryOption"] {
  return value === "Retiro" || value === "Consultar envío";
}

function sanitizeOrderItem(raw: unknown): OrderItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  if (typeof item.productId !== "string" || item.productId.trim() === "") return null;
  if (typeof item.presentation !== "string" || item.presentation.trim() === "") return null;
  return {
    productId: item.productId,
    presentation: item.presentation,
    quantity: clampQuantity(item.quantity),
  };
}

function sanitizeOrder(raw: unknown): Order | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as Record<string, unknown>;
  if (parsed.version !== 1 || !Array.isArray(parsed.items)) return null;

  const merged = new Map<string, OrderItem>();
  for (const entry of parsed.items) {
    const item = sanitizeOrderItem(entry);
    if (!item) continue;
    const key = `${item.productId}::${item.presentation}`;
    const existing = merged.get(key);
    if (existing) {
      merged.set(key, {
        ...existing,
        quantity: clampQuantity(existing.quantity + item.quantity),
      });
    } else {
      merged.set(key, item);
    }
  }

  const order: Order = {
    version: 1,
    items: Array.from(merged.values()),
    deliveryOption: isDeliveryOption(parsed.deliveryOption)
      ? parsed.deliveryOption
      : DEFAULT_ORDER.deliveryOption,
  };

  if (typeof parsed.observations === "string") {
    order.observations = parsed.observations;
  }

  return order;
}

function readStoredOrder(): Order {
  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return { ...DEFAULT_ORDER };
    const sanitized = sanitizeOrder(JSON.parse(stored));
    return sanitized ?? { ...DEFAULT_ORDER };
  } catch (error) {
    // JSON corrupto / payload inválido esperado: recuperar en silencio en producción.
    if (process.env.NODE_ENV === "development") {
      console.warn("Order localStorage recovery: discarded invalid payload", error);
    }
    return { ...DEFAULT_ORDER };
  }
}

function persistOrder(order: Order) {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(order));
  } catch (error) {
    // Quota / privacy mode: no es un error de parseo esperado.
    console.error("Failed to save order to localStorage", error);
  }
}

type Listener = () => void;

let memoryOrder: Order = { ...DEFAULT_ORDER };
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Order {
  return memoryOrder;
}

function getServerSnapshot(): Order {
  return DEFAULT_ORDER;
}

function getHydratedSnapshot(): boolean {
  return hydrated;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

function hydrateFromStorage() {
  if (hydrated || typeof window === "undefined") return;
  memoryOrder = readStoredOrder();
  hydrated = true;
  emit();
}

function commitOrder(next: Order) {
  memoryOrder = next;
  if (hydrated) {
    persistOrder(memoryOrder);
  }
  emit();
}

function updateOrder(updater: (prev: Order) => Order) {
  commitOrder(updater(memoryOrder));
}

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const order = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = useSyncExternalStore(
    subscribe,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  );

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const addItem = useCallback(
    (productId: string, presentation: string, quantity: number = 1) => {
      const safeQuantity = clampQuantity(quantity);
      updateOrder((prev) => {
        const existing = prev.items.find(
          (i) => i.productId === productId && i.presentation === presentation
        );
        if (existing) {
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.productId === productId && i.presentation === presentation
                ? { ...i, quantity: clampQuantity(i.quantity + safeQuantity) }
                : i
            ),
          };
        }
        const newItem: OrderItem = {
          productId,
          presentation,
          quantity: safeQuantity,
        };
        return { ...prev, items: [...prev.items, newItem] };
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, presentation: string) => {
    updateOrder((prev) => ({
      ...prev,
      items: prev.items.filter(
        (i) => !(i.productId === productId && i.presentation === presentation)
      ),
    }));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, presentation: string, quantity: number) => {
      const safeQuantity = clampQuantity(quantity);
      updateOrder((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.productId === productId && i.presentation === presentation
            ? { ...i, quantity: safeQuantity }
            : i
        ),
      }));
    },
    []
  );

  const updatePresentation = useCallback(
    (productId: string, oldPresentation: string, newPresentation: string) => {
      if (oldPresentation === newPresentation) return;
      updateOrder((prev) => {
        const item = prev.items.find(
          (i) => i.productId === productId && i.presentation === oldPresentation
        );
        if (!item) return prev;

        const withoutOld = prev.items.filter(
          (i) => !(i.productId === productId && i.presentation === oldPresentation)
        );
        const existingTarget = withoutOld.find(
          (i) => i.productId === productId && i.presentation === newPresentation
        );

        if (existingTarget) {
          return {
            ...prev,
            items: withoutOld.map((i) =>
              i.productId === productId && i.presentation === newPresentation
                ? {
                    ...i,
                    quantity: clampQuantity(i.quantity + item.quantity),
                  }
                : i
            ),
          };
        }

        return {
          ...prev,
          items: [
            ...withoutOld,
            {
              productId,
              presentation: newPresentation,
              quantity: item.quantity,
            },
          ],
        };
      });
    },
    []
  );

  const clearOrder = useCallback(() => {
    commitOrder({ ...DEFAULT_ORDER });
  }, []);

  const setObservations = useCallback((obs: string) => {
    updateOrder((prev) => ({ ...prev, observations: obs }));
  }, []);

  const setDeliveryOption = useCallback((option: Order["deliveryOption"]) => {
    updateOrder((prev) => ({ ...prev, deliveryOption: option }));
  }, []);

  const value: OrderContextValue = {
    order,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    updatePresentation,
    clearOrder,
    setObservations,
    setDeliveryOption,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return ctx;
};
