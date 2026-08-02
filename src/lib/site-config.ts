export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const siteConfig = {
  name: "University of Antique",
  shortName: "UA",
  tagline: "Building the Future of Antique",
  description:
    "The University of Antique is a state university in Sibalom, Antique, Philippines, offering quality higher education, research, extension, and production services.",
  url: "https://universityofantique.edu.ph",
  email: "admissions@universityofantique.edu.ph",
  phone: "(036) 540-9208",
  address: "University of Antique, Sibalom, Antique 5713, Philippines",
  applicationFeeLabel: "Application Fee",
  applicationFee: 500,
  socials: {
    facebook: "https://facebook.com/universityofantique",
    twitter: "https://twitter.com/universityantique",
    youtube: "https://youtube.com/@universityofantique",
  },
  nav: [
    {
      label: "About",
      href: "/about",
      children: [
        { label: "History", href: "/about#history" },
        { label: "Vision & Mission", href: "/about#vision-mission" },
        { label: "The UA Hymn", href: "/about#hymn" },
        { label: "University Seal", href: "/about#seal" },
        { label: "Organizational Structure", href: "/about#organization" },
      ],
    },
    {
      label: "Academics",
      href: "/academics",
      children: [
        { label: "Colleges & Programs", href: "/academics" },
        { label: "Graduate School", href: "/academics#graduate-school" },
        { label: "Research", href: "/academics#research" },
      ],
    },
    {
      label: "Admission",
      href: "/apply",
      children: [
        { label: "How to Apply", href: "/apply" },
        { label: "Requirements", href: "/apply#requirements" },
        { label: "Application Fee", href: "/apply#fee" },
        { label: "Check Application Status", href: "/login" },
      ],
    },
    { label: "News & Events", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
} satisfies {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  address: string;
  applicationFeeLabel: string;
  applicationFee: number;
  socials: { facebook: string; twitter: string; youtube: string };
  nav: NavItem[];
};

export const applicationStatusMeta: Record<
  string,
  { label: string; description: string; tone: "default" | "primary" | "success" | "destructive" | "warning" }
> = {
  DRAFT: {
    label: "Draft",
    description: "Your application is being prepared. Complete all steps to submit.",
    tone: "default",
  },
  PENDING: {
    label: "Pending",
    description: "We have received your application and payment. It is queued for review.",
    tone: "primary",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    description: "The Admissions Committee is evaluating your application and documents.",
    tone: "warning",
  },
  ACCEPTED: {
    label: "Qualified",
    description: "Congratulations! You are qualified. The registrar will contact you for enrollment.",
    tone: "success",
  },
  REJECTED: {
    label: "Not Qualified",
    description: "We regret to inform you that your application was not qualified for the program.",
    tone: "destructive",
  },
} as const;
