import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { BackToTop } from "@/components/shared/back-to-top";
import { getExternalLinks } from "@/lib/external-links";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const externalLinks = await getExternalLinks();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar links={externalLinks} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
