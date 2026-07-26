import {
  ADDRESS,
  HOURS,
  PHONE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-surface">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">{SITE_NAME}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{SITE_DESCRIPTION}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--accent)]">Contacto</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{PHONE}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{ADDRESS}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--accent)]">Horarios</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{HOURS}</p>
        </div>
      </div>
    </footer>
  );
}
