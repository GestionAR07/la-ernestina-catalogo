import Image from "next/image";
import { SITE_DESCRIPTION, SITE_NAME, WHATSAPP_NUMBER } from "@/config/site";
import { isWhatsAppConfigured } from "@/utils/whatsapp";

/**
 * Hero principal.
 * Imagen: `hero.webp` (~191 KB). Original `hero.png` se conserva como respaldo.
 */
export function HeroSection() {
  const showWhatsAppCta = isWhatsAppConfigured(WHATSAPP_NUMBER);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-[var(--border)]"
    >
      <div className="relative min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem] lg:min-h-[34rem]">
        <Image
          src="/images/hero/hero.webp"
          alt="Mascotas y alimentos de forrajería La Ernestina"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_32%] sm:object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/75 to-[var(--background)]/30"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex min-h-[22rem] w-full max-w-6xl flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[26rem] sm:px-6 sm:pb-10 sm:pt-28 md:min-h-[30rem] lg:min-h-[34rem] lg:px-8 lg:pb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)] sm:text-sm">
            {SITE_DESCRIPTION}
          </p>
          <h1
            id="hero-heading"
            className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
          >
            {SITE_NAME}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-lg">
            Alimentos para mascotas y animales de granja. Elegí tus productos y
            armá tu pedido de forma simple.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <a
              href="#catalogo"
              className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft motion-safe-transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
            >
              Ver productos
            </a>
            {showWhatsAppCta ? (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-[var(--border)] bg-[var(--surface)]/70 px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] backdrop-blur motion-safe-transition hover:bg-surface-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
              >
                Pedir por WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
