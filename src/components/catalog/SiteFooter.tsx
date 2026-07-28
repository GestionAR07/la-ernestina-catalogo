import {
  ADDRESS,
  HOURS,
  PAYMENT_METHODS,
  PHONE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIALS,
  hasPublicContactValue,
} from "@/config/site";

export function SiteFooter() {
  const phone = hasPublicContactValue(PHONE) ? PHONE.trim() : null;
  const address = hasPublicContactValue(ADDRESS) ? ADDRESS.trim() : null;
  const hours = hasPublicContactValue(HOURS) ? HOURS.trim() : null;
  const payments = PAYMENT_METHODS.filter((method) => hasPublicContactValue(method));
  const socialEntries = (
    Object.entries(SOCIALS) as ReadonlyArray<readonly [string, string]>
  ).filter(([, url]) => hasPublicContactValue(url));

  const hasContactBlock = Boolean(phone || address || socialEntries.length > 0);
  const hasHoursBlock = Boolean(hours);
  const hasPaymentsBlock = payments.length > 0;
  const hasExtraInfo = hasContactBlock || hasHoursBlock || hasPaymentsBlock;

  return (
    <footer
      id="contacto"
      className="border-t border-[var(--border)] bg-surface"
    >
      <div
        className={`mx-auto max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:px-8 ${
          hasExtraInfo ? "grid sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
        }`}
      >
        <div className={`space-y-2 ${hasExtraInfo ? "" : "max-w-xl"}`}>
          <p className="text-lg font-semibold text-[var(--text-primary)]">{SITE_NAME}</p>
          <p className="text-sm text-[var(--text-secondary)]">{SITE_DESCRIPTION}</p>
          <p className="pt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            Catálogo orientativo para armar pedidos. La disponibilidad y el total
            final se confirman con el comercio.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </p>
        </div>

        {hasContactBlock ? (
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">Contacto</p>
            {phone ? (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{phone}</p>
            ) : null}
            {address ? (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{address}</p>
            ) : null}
            {socialEntries.length > 0 ? (
              <ul className="mt-3 space-y-1">
                {socialEntries.map(([label, url]) => (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--text-secondary)] underline-offset-2 hover:text-[var(--text-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {hasHoursBlock || hasPaymentsBlock ? (
          <div className="space-y-4">
            {hasHoursBlock ? (
              <div>
                <p className="text-sm font-medium text-[var(--accent)]">Horarios</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{hours}</p>
              </div>
            ) : null}
            {hasPaymentsBlock ? (
              <div>
                <p className="text-sm font-medium text-[var(--accent)]">Medios de pago</p>
                <ul className="mt-2 list-inside list-disc text-sm text-[var(--text-secondary)]">
                  {payments.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
