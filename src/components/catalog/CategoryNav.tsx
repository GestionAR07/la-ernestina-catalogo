"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/data/categories";

export type CategoryFilter = "Todos" | (typeof CATEGORIES)[number];

interface CategoryNavProps {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  counts: Record<string, number>;
}

export function CategoryNav({ active, onChange, counts }: CategoryNavProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const totalCount = Object.values(counts).reduce((sum, value) => sum + value, 0);

  const visibleFilters: CategoryFilter[] = [
    "Todos",
    ...CATEGORIES.filter((category) => (counts[category] ?? 0) > 0),
  ];

  const updateOverflow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(maxScroll > 2 && el.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateOverflow();
    el.addEventListener("scroll", updateOverflow, { passive: true });
    window.addEventListener("resize", updateOverflow);

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateOverflow) : null;
    observer?.observe(el);

    return () => {
      el.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", updateOverflow);
      observer?.disconnect();
    };
  }, [updateOverflow, visibleFilters.length]);

  return (
    <nav aria-label="Categorías del catálogo" className="border-b border-[var(--border)]">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-3 sm:mx-0 sm:px-0"
        >
          {visibleFilters.map((category) => {
            const isActive = category === active;
            const count = category === "Todos" ? totalCount : (counts[category] ?? 0);

            return (
              <button
                key={category}
                type="button"
                onClick={() => onChange(category)}
                aria-pressed={isActive}
                aria-label={`${category}, ${count} ${count === 1 ? "producto" : "productos"}`}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-control px-4 text-sm font-medium motion-safe-transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] ${
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "bg-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded-control px-1.5 py-0.5 text-xs ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[var(--background)] text-[var(--text-secondary)]"
                  }`}
                  aria-hidden="true"
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--background)] to-transparent transition-opacity ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--background)] to-transparent transition-opacity ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
    </nav>
  );
}
