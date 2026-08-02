import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TeacherNav } from "@/components/teacher/teacher-nav";

export const dynamic = "force-dynamic";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "TEACHER") redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <TeacherNav name={session.user.name ?? "Teacher"} email={session.user.email ?? ""} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <Link href="/" className="font-semibold text-crimson-700 hover:underline">
          University of Antique
        </Link>{" "}
        · Faculty Portal ·{" "}
        <Link href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
