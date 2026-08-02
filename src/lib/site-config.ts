export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; external?: boolean }[];
}

export const siteConfig = {
  name: "University of Antique",
  shortName: "UA",
  tagline: "Transforming Lives & Building Communities",
  description:
    "The University of Antique is a state university in Sibalom, Antique, Philippines, offering quality higher education, research, extension, and production services.",
  url: "https://www.antiquespride.edu.ph",
  email: "admissions@universityofantique.edu.ph",
  phone: "(036) 540-9208",
  address: "University of Antique, Sibalom, Antique 5713, Philippines",
  applicationFeeLabel: "Application Fee",
  applicationFee: 500,
  stats: {
    students: "25,722",
    studentsLabel: "Total Enrolled · 2nd Sem AY 2024–2025",
    faculty: "683",
    facultyLabel: "Faculty Members",
    programs: "96",
    programsLabel: "Programs Offered",
  },
  quickLinks: {
    admission: {
      title: "Admission",
      description: "New applicants may begin online.",
      items: [
        { label: "Admission Portal", href: "https://sims.antiquespride.edu.ph/aims/application/" },
        { label: "Admission Requirements", href: "/apply#requirements" },
        { label: "Procedure for Enrollment", href: "https://www.antiquespride.edu.ph/procedure-for-enrollment/" },
      ],
    },
    student: {
      title: "Student",
      description: "Portal, LMS, and records systems.",
      items: [
        { label: "AIMS: Student", href: "https://sims.antiquespride.edu.ph/aims/students/" },
        { label: "eskUelA LMS", href: "https://eskuela.pinnacle.edu.ph/" },
        { label: "LIS", href: "https://lis.antiquespride.edu.ph/" },
      ],
    },
    faculty: {
      title: "Faculty",
      description: "Systems for UA faculty members.",
      items: [
        { label: "AIMS: Faculty", href: "https://sims.antiquespride.edu.ph/aims/faculty/" },
        { label: "eskUelA LMS", href: "https://eskuela.pinnacle.edu.ph/" },
        { label: "HRIS", href: "https://sims.antiquespride.edu.ph/hris/" },
      ],
    },
    other: {
      title: "Other Services",
      description: "Helpdesk & document requests.",
      items: [
        { label: "ICTU Helpdesk", href: "https://support.universityofantique.edu.ph" },
        { label: "Document Request", href: "https://www.antiquespride.edu.ph/studentdocumentonlinerequest/" },
        { label: "Request a Feedback", href: "https://www.antiquespride.edu.ph/feedback/" },
      ],
    },
  },
  transparencySeals: [
    { label: "Transparency Seal", href: "https://antiquespride.edu.ph/ua-transparency-seal/" },
    { label: "FOI", href: "/ua-transparency-seal" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Bids and Awards", href: "https://antiquespride.edu.ph/bids-and-awards/" },
  ],
  socials: {
    facebook: "https://www.facebook.com/universityofantiqueph",
    twitter: "https://twitter.com/UA_Antique",
    youtube: "https://www.youtube.com/@universityofantique",
  },
  nav: [
    {
      label: "About",
      href: "/about",
      children: [
        { label: "Mandates & VMGO", href: "/about#vision-mission" },
        { label: "History", href: "/about#history" },
        { label: "The UA Hymn", href: "/about#hymn" },
        { label: "University Seal", href: "/about#seal" },
        { label: "Transparency Seal", href: "https://antiquespride.edu.ph/ua-transparency-seal/", external: true },
        { label: "Privacy Policy", href: "https://www.antiquespride.edu.ph/privacy-policy/", external: true },
      ],
    },
    {
      label: "Academics",
      href: "/academics",
      children: [
        { label: "Program Offerings", href: "/academics" },
        { label: "Colleges", href: "/academics" },
        { label: "Graduate School", href: "/academics#graduate-school" },
      ],
    },
    {
      label: "Admission",
      href: "/apply",
      children: [
        { label: "How to Apply", href: "/apply" },
        { label: "Requirements", href: "/apply#requirements" },
        { label: "Application Fee", href: "/apply#fee" },
        { label: "Admission Portal", href: "https://sims.antiquespride.edu.ph/aims/application/", external: true },
        { label: "Check Application Status", href: "/login" },
      ],
    },
    {
      label: "Student Services",
      href: "/services",
      children: [
        { label: "Health Services", href: "https://www.antiquespride.edu.ph/health-services/", external: true },
        { label: "Scholarships", href: "https://www.antiquespride.edu.ph/scholarship-and-financial-assistance-unit/", external: true },
        { label: "Student Affairs & Services", href: "https://www.antiquespride.edu.ph/student-affairs-services-2/", external: true },
        { label: "Library Services", href: "https://www.antiquespride.edu.ph/library-services/", external: true },
      ],
    },
    {
      label: "Campuses",
      href: "/campuses",
      children: [
        { label: "Tario Lim Memorial Campus", href: "https://tlmc.antiquespride.edu.ph", external: true },
        { label: "Libertad Campus", href: "https://lc.antiquespride.edu.ph", external: true },
        { label: "Caluya Campus", href: "https://www.antiquespride.edu.ph", external: true },
        { label: "Hamtic Campus", href: "https://hc.antiquespride.edu.ph", external: true },
      ],
    },
    { label: "News & Events", href: "/news" },
    { label: "Contact Us", href: "/contact" },
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
  stats: { students: string; studentsLabel: string; faculty: string; facultyLabel: string; programs: string; programsLabel: string };
  quickLinks: Record<
    string,
    { title: string; description: string; items: { label: string; href: string }[] }
  >;
  transparencySeals: { label: string; href: string }[];
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
