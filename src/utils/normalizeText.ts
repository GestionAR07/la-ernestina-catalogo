/**
 * Normaliza texto para búsqueda: minúsculas, sin tildes,
 * sin espacios extremos y con espacios internos colapsados.
 */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
