import { CatalogShell } from "@/components/catalog/CatalogShell";
import { HeroSection } from "@/components/catalog/HeroSection";
import { ProductCatalog } from "@/components/catalog/ProductCatalog";
import { SiteFooter } from "@/components/catalog/SiteFooter";

export default function Home() {
  return (
    <div id="inicio" className="flex min-h-screen flex-col">
      <CatalogShell>
        <main className="flex-1">
          <HeroSection />
          <ProductCatalog />
        </main>
        <SiteFooter />
      </CatalogShell>
    </div>
  );
}
