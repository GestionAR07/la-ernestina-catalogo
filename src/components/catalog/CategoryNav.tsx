"use client";

import { CATEGORIES } from "@/data/categories";

export type CategoryFilter = "Todos" | (typeof CATEGORIES)[number];

interface CategoryNavProps {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  counts: Record<string, number>;
}

const FILTERS: CategoryFilter[] = ["Todos", ...CATEGORIES];

export function CategoryNav({ active, onChange, counts }: CategoryNavProps) {
  return (
    <nav aria-label="Categorías del catálogo" className="border-b border-[var(--border)]">
      <div className="scrollbar-thin-x -mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        {FILTERS.map((category) => {
          const isActive = category === active;
          const count =
            category === "Todos"
              ? Object.values(counts).reduce((sum, value) => sum + value, 0)
              : (counts[category] ?? 0);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              aria-pressed={isActive}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span>{category}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-xs ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-[var(--background)] text-[var(--text-secondary)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
