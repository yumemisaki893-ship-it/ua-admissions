import Link from "next/link";
import { ClipboardList, FileUp, Info, FileText, Image as ImageIcon, ShieldCheck, Wallet } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApplicationFee } from "@/lib/paymongo";
import { getSettings } from "@/lib/actions/admin";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  const [settings] = await Promise.all([getSettings()]);
  const fee = settings.applicationFee ?? getApplicationFee();

  const requirements = [
    {
      icon: FileText,
      title: "PSA Birth Certificate",
      note: "PDF, PNG, or JPEG · max 5MB",
    },
    {
      icon: FileUp,
      title: "Form 137 (High School Records)",
      note: "Copy of your official high school records",
    },
    {
      icon: ImageIcon,
      title: "2x2 ID Picture",
      note: "Recent, white background",
    },
  ];

  const steps = [
    { num: "01", title: "Create an account", desc: "Sign up with your email address and a secure password." },
    { num: "02", title: "Complete your profile", desc: "Enter your personal information and contact details." },
    { num: "03", title: "Select your course", desc: "Choose the degree program you wish to pursue." },
    { num: "04", title: "Upload requirements", desc: "Submit scanned copies of your documents." },
    { num: "05", title: "Pay the application fee", desc: `Pay the non-refundable PHP ${fee.toLocaleString()} fee via GCash, Maya, or card.` },
    { num: "06", title: "Submit & track", desc: "Get your reference number and monitor your application status." },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 70%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Admission</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">How to Apply</h1>
          <p className="mt-4 text-red-50">
            Your journey to becoming a University of Antique student starts here — entirely online.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" className="bg-yellow-300 text-crimson-900 shadow-lg hover:bg-white" asChild>
              <Link href="/register">Start Your Application</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-yellow-300 hover:text-crimson-900"
              asChild
            >
              <Link href="/login">Track Your Application</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Process"
          title="Six Simple Steps"
          description="The entire application is handled online through the UA Student Portal."
        />
        <ol className="stagger mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.num}>
              <Card className="h-full border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10">
                <CardContent className="p-6">
                  <span className="font-display text-4xl font-bold text-amber-300">{step.num}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{step.desc}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section id="requirements" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Prepare These"
            title="Application Requirements"
            description="Scan or take clear photos of these documents before starting your application."
          />
          <div className="stagger mt-12 grid gap-6 md:grid-cols-3">
            {requirements.map((req) => (
              <Card key={req.title} className="border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10">
                <CardContent className="flex items-start gap-4 p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/30">
                    <req.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-slate-900">{req.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{req.note}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-amber-300 bg-yellow-50 p-4 text-sm text-slate-600">
            <Info className="h-5 w-5 shrink-0 text-amber-500" />
            Files must be in <strong className="text-slate-900">PDF, PNG, or JPEG</strong> format and no larger than{" "}
            <strong className="text-slate-900">5 MB</strong> each. Accepted file types are strictly enforced.
          </div>
        </div>
      </section>

      <section id="fee" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Payment"
              title="Application Fee"
              description="A non-refundable fee covers the processing and evaluation of your application."
            />
            <ul className="mt-8 space-y-4">
              {[
                { icon: Wallet, text: "Pay securely through GCash, Maya, or credit/debit card" },
                { icon: ShieldCheck, text: "Payments are processed by PayMongo, PCI-DSS compliant" },
                { icon: ClipboardList, text: "Your payment is verified automatically after checkout" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-amber-600 ring-1 ring-amber-200">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <p className="pt-1.5 text-slate-500">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <Card className="overflow-hidden border-slate-200 bg-white shadow-xl shadow-red-900/10">
            <div className="bg-gradient-to-br from-crimson-700 to-crimson-900 p-8 text-center text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Application Fee</p>
              <p className="mt-3 font-display text-5xl font-semibold">PHP {fee.toLocaleString()}</p>
              <p className="mt-2 text-sm text-red-50">Non-refundable · Payable online</p>
            </div>
            <CardContent className="p-8">
              <div className="space-y-3 text-sm">
                {["GCash", "Maya", "Credit / Debit Card"].map((m) => (
                  <div key={m} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="font-medium text-slate-900">{m}</span>
                    <Badge variant="success">Available</Badge>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-6 w-full bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900" asChild>
                <Link href="/register">Proceed with Application</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-slate-400">
                For fee concerns, contact {siteConfig.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
