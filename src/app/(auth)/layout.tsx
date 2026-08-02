import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-navy-950">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-800/40 via-transparent to-navy-900" />
      <header className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Link href="/" aria-label="Back to homepage">
          <Logo light />
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="relative z-10 pb-6 text-center text-xs text-navy-400">
        © {new Date().getFullYear()} University of Antique · {""}
        <Link href="/" className="underline-offset-2 hover:underline">
          Back to website
        </Link>
      </footer>
    </div>
  );
}
