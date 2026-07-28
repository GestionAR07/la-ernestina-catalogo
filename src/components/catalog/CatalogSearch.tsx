"use client";

import { useId } from "react";
import { Search, X } from "lucide-react";

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function CatalogSearch({ value, onChange, resultCount }: CatalogSearchProps) {
  const inputId = useId();
  const countId = useId();
  const hasQuery = value.trim().length > 0;

  return (
    <div className="w-full sm:max-w-sm sm:shrink-0 lg:max-w-md">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          Buscar productos
        </label>
        <p
          id={countId}
          className="text-xs tabular-nums text-[var(--text-secondary)]"
          aria-live="polite"
        >
          {hasQuery
            ? `${resultCount} ${resultCount === 1 ? "resultado" : "resultados"}`
            : `${resultCount} ${resultCount === 1 ? "producto" : "productos"}`}
        </p>
      </div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar productos"
          autoComplete="off"
          aria-describedby={countId}
          className="min-h-11 w-full rounded-control border border-[var(--border)] bg-[var(--background)] py-2 pr-11 pl-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
            className="absolute top-1/2 right-1.5 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-control text-[var(--text-secondary)] motion-safe-transition hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
