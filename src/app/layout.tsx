import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "University of Antique",
    "UA",
    "Sibalom",
    "Antique",
    "state university",
    "college admission",
    "Philippines",
  ],
  icons: {
    icon: [{ url: "/ua/ua-logo.png", sizes: "240x240", type: "image/png" }],
    apple: [{ url: "/ua/ua-logo.png", sizes: "240x240", type: "image/png" }],
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_PH",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9d0505",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-background"
        >
          <div className="absolute inset-0 bg-[radial-gradient(90rem_48rem_at_50%_-12%,hsl(0_55%_26%/0.55),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(70rem_36rem_at_88%_10%,hsl(227_40%_14%/0.55),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-[30rem] bg-[radial-gradient(60rem_26rem_at_50%_100%,hsl(48_65%_24%/0.22),transparent)]" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
