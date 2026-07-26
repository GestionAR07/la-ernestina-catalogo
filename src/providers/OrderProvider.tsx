"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Order, OrderItem } from "@/types/order";

interface OrderContextValue {
  order: Order;
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

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>(() => {
    if (typeof window === "undefined") {
      return { version: 1, items: [], deliveryOption: "Retiro" };
    }
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && parsed.version === 1 && Array.isArray(parsed.items)) {
          return parsed as Order;
        }
      }
    } catch (e) {
      console.error("Failed to parse order from localStorage", e);
    }
    return { version: 1, items: [], deliveryOption: "Retiro" };
  });


  // Persist to localStorage on change (after hydration)
  useEffect(() => {

    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(order));
    } catch (e) {
      console.error("Failed to save order to localStorage", e);
    }
  }, [order]);

  const addItem = (productId: string, presentation: string, quantity: number = 1) => {
    setOrder((prev) => {
      const existing = prev.items.find(
        (i) => i.productId === productId && i.presentation === presentation
      );
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.productId === productId && i.presentation === presentation
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      const newItem: OrderItem = { productId, presentation, quantity };
      return { ...prev, items: [...prev.items, newItem] };
    });
  };

  const removeItem = (productId: string, presentation: string) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter(
        (i) => !(i.productId === productId && i.presentation === presentation)
      ),
    }));
  };

  const updateQuantity = (productId: string, presentation: string, quantity: number) => {
    if (quantity < 1) quantity = 1;
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId && i.presentation === presentation
          ? { ...i, quantity }
          : i
      ),
    }));
  };

  const updatePresentation = (
    productId: string,
    oldPresentation: string,
    newPresentation: string
  ) => {
    setOrder((prev) => {
      const item = prev.items.find(
        (i) => i.productId === productId && i.presentation === oldPresentation
      );
      if (!item) return prev;
      // Remove old and add new with same quantity
      const withoutOld = prev.items.filter(
        (i) => !(i.productId === productId && i.presentation === oldPresentation)
      );
      const newItem: OrderItem = {
        productId,
        presentation: newPresentation,
        quantity: item.quantity,
      };
      return { ...prev, items: [...withoutOld, newItem] };
    });
  };

  const clearOrder = () => {
    setOrder({ version: 1, items: [], deliveryOption: "Retiro" });
  };

  const setObservations = (obs: string) => {
    setOrder((prev) => ({ ...prev, observations: obs }));
  };

  const setDeliveryOption = (option: Order["deliveryOption"]) => {
    setOrder((prev) => ({ ...prev, deliveryOption: option }));
  };

  const value: OrderContextValue = {
    order,
    addItem,
    removeItem,
    updateQuantity,
    updatePresentation,
    clearOrder,
    setObservations,
    setDeliveryOption,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return ctx;
};
