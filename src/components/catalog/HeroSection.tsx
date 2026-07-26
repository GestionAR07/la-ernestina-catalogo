import Image from "next/image";
import { SITE_DESCRIPTION, SITE_NAME } from "@/config/site";

/**
 * Hero principal.
 * Nota de rendimiento: el original `hero.png` (~944 KB, contenedor JPEG) se conserva.
 * Esta fase sirve `hero.webp` (~191 KB, calidad 82) para reducir peso percibido sin cambiar el encuadre.
 * AVIF (~94 KB) quedó generado en audit-artifacts para evaluación; no se adoptó aún por compatibilidad/verificación visual.
 */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[70vh] overflow-hidden border-b border-[var(--border)]"
    >
      <Image
        src="/images/hero/hero.webp"
        alt="Interior y productos de forrajería La Ernestina"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-[var(--background)]/25"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          {SITE_DESCRIPTION}
        </p>
        <h1
          id="hero-heading"
          className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
        >
          {SITE_NAME}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          Catálogo para armar tu pedido y enviarlo por WhatsApp cuando el
          comercio configure el contacto.
        </p>
        <div className="mt-8">
          <a
            href="#catalogo"
            className="inline-flex min-h-11 items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)]"
          >
            Ver catálogo
          </a>
        </div>
      </div>
    </section>
  );
}
