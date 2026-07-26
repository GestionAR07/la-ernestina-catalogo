"use client";

import { useRef, useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { OrderDrawer } from "@/components/catalog/OrderDrawer";

export function CatalogShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const orderButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <SiteHeader ref={orderButtonRef} onOpenOrder={() => setDrawerOpen(true)} />
      {children}
      <OrderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        returnFocusRef={orderButtonRef}
      />
    </>
  );
}
