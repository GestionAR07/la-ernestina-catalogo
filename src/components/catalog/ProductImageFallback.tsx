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
      className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(160deg,var(--surface-elevated)_0%,var(--background)_55%,#101813_100%)] px-3 text-center"
      role="img"
      aria-label={`${productName}, categoría ${category}`}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-[var(--border)] bg-[var(--surface)]/80 text-[var(--primary-soft)] shadow-soft">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-[11px] font-medium tracking-wide text-[var(--text-secondary)] uppercase">
        {label}
      </span>
    </div>
  );
}
