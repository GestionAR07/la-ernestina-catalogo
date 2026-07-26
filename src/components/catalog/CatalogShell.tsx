"use client";

import { useRef, useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { OrderDrawer } from "@/components/catalog/OrderDrawer";

export function CatalogShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const orderButtonRef = useRef<HTMLButtonElement>(null);
  const drawerTitleId = "order-drawer-title";

  return (
    <>
      <SiteHeader
        ref={orderButtonRef}
        orderOpen={drawerOpen}
        drawerId="order-drawer"
        onOpenOrder={() => setDrawerOpen(true)}
      />
      {children}
      <OrderDrawer
        id="order-drawer"
        titleId={drawerTitleId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        returnFocusRef={orderButtonRef}
      />
    </>
  );
}
