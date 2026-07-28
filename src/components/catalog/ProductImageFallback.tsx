import type { LucideIcon } from "lucide-react";
import {
  Bird,
  Bone,
  Cat,
  Dog,
  Package,
  Rabbit,
  Tag,
  Wheat,
} from "lucide-react";

interface ProductImageFallbackProps {
  productName: string;
  category: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Perros: Dog,
  Gatos: Cat,
  "Cereales y semillas": Wheat,
  Aves: Bird,
  "Animales de granja": Rabbit,
  "Alimentos balanceados": Package,
  Accesorios: Bone,
  Ofertas: Tag,
};

function shortCategoryLabel(category: string): string {
  if (category === "Cereales y semillas") return "Cereales";
  if (category === "Animales de granja") return "Granja";
  if (category === "Alimentos balanceados") return "Balanceados";
  return category;
}

export function ProductImageFallback({
  productName,
  category,
}: ProductImageFallbackProps) {
  const Icon = CATEGORY_ICONS[category] ?? Package;
  const label = shortCategoryLabel(category);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--surface-elevated)_0%,var(--background)_68%)] px-3 text-center"
      role="img"
      aria-label={`${productName}, categoría ${category}`}
    >
      <Icon
        className="pointer-events-none absolute top-1/2 left-1/2 h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 text-[var(--primary-soft)] opacity-[0.08]"
        aria-hidden="true"
        strokeWidth={1.25}
      />
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-control border border-[var(--border)] bg-[var(--surface)]/85 text-[var(--primary-soft)] shadow-soft">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
