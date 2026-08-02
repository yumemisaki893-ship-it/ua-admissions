import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
