import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PortalNav } from "@/components/portal/portal-nav";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "STUDENT") redirect("/admin");

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });
  const initials = (session.user.name ?? "S")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PortalNav initials={initials} name={session.user.name ?? "Student"} unreadCount={unreadCount} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-white/10 bg-slate-950/80 py-4 text-center text-xs text-slate-400 backdrop-blur-xl">
        <Link href="/" className="font-semibold text-crimson-300 hover:underline">
          University of Antique
        </Link>{" "}
        · Student Portal ·{" "}
        <Link href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
