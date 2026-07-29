"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { OrderBottomSheet } from "@/components/catalog/OrderBottomSheet";
import {
  ORDER_DESKTOP_PANEL_ID,
  OrderDesktopPanel,
} from "@/components/catalog/OrderDesktopPanel";

const XL_QUERY = "(min-width: 1280px)";
const ORDER_SHEET_ID = "order-sheet";

export function CatalogShell({
  hero,
  catalog,
  footer,
}: {
  hero: ReactNode;
  catalog: ReactNode;
  footer: ReactNode;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const orderButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia(XL_QUERY);
    const onChange = () => {
      if (media.matches) setSheetOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const onOrderButtonClick = useCallback(() => {
    const isDesktop = window.matchMedia(XL_QUERY).matches;
    if (isDesktop) {
      const panel = document.getElementById(ORDER_DESKTOP_PANEL_ID);
      panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      window.requestAnimationFrame(() => {
        panel?.focus({ preventScroll: true });
      });
      return;
    }
    setSheetOpen(true);
  }, []);

  return (
    <>
      <SiteHeader
        ref={orderButtonRef}
        orderOpen={sheetOpen}
        drawerId={ORDER_SHEET_ID}
        desktopPanelId={ORDER_DESKTOP_PANEL_ID}
        onOpenOrder={onOrderButtonClick}
      />
      <main className="flex-1">
        {hero}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-[minmax(0,1fr)_22.5rem] xl:items-start xl:gap-8">
          <div className="min-w-0">{catalog}</div>
          <OrderDesktopPanel />
        </div>
      </main>
      {footer}
      <OrderBottomSheet
        id={ORDER_SHEET_ID}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        returnFocusRef={orderButtonRef}
      />
    </>
  );
}
