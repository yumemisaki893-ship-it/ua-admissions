import { Mail, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: [
      "The University of Antique (“the University”, “we”, “us”, “our”) is committed to protecting the privacy and security of the personal information it collects, in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173), its Implementing Rules and Regulations, and the National Privacy Commission issuances.",
      "This Privacy Policy explains what personal data we collect, why we collect it, how we use and protect it, and the rights you have over it when you use this website and the Student Information Management and Admission System.",
    ],
  },
  {
    id: "collected",
    title: "Information We Collect",
    body: [
      "Personal information: your full name, date of birth, gender, address, contact number, e-mail address, guardian details, and other details you provide when creating an account or submitting an application.",
      "Application records: the course you applied for, uploaded documents (PSA birth certificate, Form 137, and 2x2 ID photo), application reference numbers, payment records, and admission decisions and remarks.",
      "Usage data: technical information such as your IP address, browser type, device information, and pages visited, collected through standard web technologies to maintain and improve the website.",
      "Communications: messages you send through the contact and feedback forms, and any correspondence with the Office of Admissions.",
    ],
  },
  {
    id: "purposes",
    title: "How We Use Your Information",
    body: [
      "To process, evaluate, and manage your admission application, including the assessment of documents and the release of admission decisions.",
      "To facilitate the payment of the application fee through our payment processor (PayMongo) and to maintain payment records.",
      "To send you important notices about your application, announcements, and updates from the University.",
      "To respond to inquiries, feedback, and requests you submit through the website.",
      "To fulfill legal, regulatory, and institutional obligations of the University.",
      "To analyze website usage and improve the quality, security, and performance of our services.",
    ],
  },
  {
    id: "disclosure",
    title: "Disclosure of Information",
    body: [
      "The University does not sell, rent, or trade your personal information. We only share it with service providers and parties as necessary to operate this website and the admission system, including:",
      "Payment processing — PayMongo, Inc., to process application fee payments. Only the information required for the transaction is shared.",
      "Cloud storage — Cloudinary, to store uploaded application documents securely.",
      "Hosting and infrastructure — our hosting providers, to operate and secure the website and database.",
      "Government agencies — only when required or authorized by law, such as the Commission on Higher Education, or upon lawful order of a court or government authority.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    body: [
      "Your personal information is retained only for as long as necessary to fulfill the purposes described in this policy, to comply with the University's records management and retention schedules, or as required by law.",
      "Application records of admitted students are incorporated into the student's official records. Records of non-admitted applicants are kept for a limited period and thereafter disposed of in a secure manner.",
      "Payment and financial records are retained in accordance with applicable accounting and auditing rules.",
    ],
  },
  {
    id: "security",
    title: "Security Measures",
    body: [
      "The University implements appropriate organizational, physical, and technical safeguards to protect your personal information, including encryption in transit and at rest, access controls, and regular monitoring.",
      "Only authorized personnel with a legitimate need may access your information, and they are bound by confidentiality obligations.",
      "While we strive to protect your data, no method of transmission or storage is completely secure. If you believe your information has been compromised, please contact us immediately.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    body: [
      "Under the Data Privacy Act of 2012, you have the right to be informed, to access, to object, to erasure or blocking, to rectify, to data portability, and to file a complaint with the National Privacy Commission.",
      "To exercise these rights, you may submit a written request to the University's Data Protection Officer using the contact details below. We will respond within the period provided by law.",
    ],
  },
  {
    id: "children",
    title: "Minors",
    body: [
      "This website and the admission system may collect information of minor applicants. By submitting an application on behalf of a minor, the parent or guardian confirms that they have authority to provide the information and consents to its processing under this policy.",
    ],
  },
  {
    id: "updates",
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. The updated policy will be posted on this page with a new effective date. Significant changes will be announced through the website.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    body: [
      `For questions, concerns, or requests regarding your personal information, you may contact the University's Data Protection Officer at ${siteConfig.email} or ${siteConfig.phone}.`,
      "You may also write to the Office of the Data Protection Officer, University of Antique, Main Campus, Sibalom, Antique, Philippines.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 70%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
            Data Protection
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-red-50">
            How the University of Antique collects, uses, and protects your personal information.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-yellow-200 ring-1 ring-white/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Effective Date: August 2, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <nav className="hidden lg:block" aria-label="Privacy policy sections">
            <div className="sticky top-24 space-y-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                On this page
              </p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-yellow-50 hover:text-crimson-700"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          <article className="space-y-8">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-slate-900">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-crimson-700/10 text-sm font-bold text-crimson-700 ring-1 ring-crimson-700/30">
                    {i + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-sm leading-relaxed text-slate-600 [&:not(:first-child)]:mt-3"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-300 bg-yellow-50 p-6 text-center sm:flex-row sm:text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-crimson-700 text-white">
                <Mail className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-crimson-700">
                  Data Protection Officer
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Send privacy-related requests to {siteConfig.email} or call {siteConfig.phone}.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
