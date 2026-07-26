export function formatPrice(price: number | undefined): string {
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return "Consultar precio";
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatUnitCount(count: number): string {
  return count === 1 ? "1 unidad" : `${count} unidades`;
}
