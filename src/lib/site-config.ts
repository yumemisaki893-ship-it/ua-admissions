export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; external?: boolean; description?: string }[];
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
        { label: "Mandates & VMGO", href: "/about#vision-mission", description: "Vision, mission, goals and objectives of the University." },
        { label: "History", href: "/about#history", description: "From the Antique School of Arts and Trades to a state university." },
        { label: "The UA Hymn", href: "/about#hymn", description: "The official anthem of the University of Antique." },
        { label: "University Seal", href: "/about#seal", description: "The symbols and story behind the UA seal." },
        { label: "Transparency Seal", href: "https://antiquespride.edu.ph/ua-transparency-seal/", external: true, description: "Open access to official documents and finances." },
        { label: "Privacy Policy", href: "https://www.antiquespride.edu.ph/privacy-policy/", external: true, description: "How the University protects your data." },
      ],
    },
    {
      label: "Academics",
      href: "/academics",
      children: [
        { label: "Program Offerings", href: "/academics", description: "All degree programs across colleges." },
        { label: "Colleges", href: "/academics", description: "Six colleges delivering UA programs." },
        { label: "Graduate School", href: "/academics#graduate-school", description: "Advanced degrees and research." },
      ],
    },
    {
      label: "Admission",
      href: "/apply",
      children: [
        { label: "How to Apply", href: "/apply", description: "Step-by-step online application guide." },
        { label: "Requirements", href: "/apply#requirements", description: "Documents needed for enrollment." },
        { label: "Application Fee", href: "/apply#fee", description: "Fee details and payment channels." },
        { label: "Admission Portal", href: "https://sims.antiquespride.edu.ph/aims/application/", external: true, description: "Apply through the official AIMS portal." },
        { label: "Check Application Status", href: "/login", description: "Track your application in the portal." },
      ],
    },
    {
      label: "Student Services",
      href: "/services",
      children: [
        { label: "Health Services", href: "https://www.antiquespride.edu.ph/health-services/", external: true, description: "Medical and dental care for students." },
        { label: "Scholarships", href: "https://www.antiquespride.edu.ph/scholarship-and-financial-assistance-unit/", external: true, description: "Financial assistance and scholarship programs." },
        { label: "Student Affairs & Services", href: "https://www.antiquespride.edu.ph/student-affairs-services-2/", external: true, description: "Guidance, discipline and student welfare." },
        { label: "Library Services", href: "https://www.antiquespride.edu.ph/library-services/", external: true, description: "Learning resources and e-library access." },
      ],
    },
    {
      label: "Campuses",
      href: "/campuses",
      children: [
        { label: "Tario Lim Memorial Campus", href: "https://tlmc.antiquespride.edu.ph", external: true, description: "Tobias Fornier, Antique." },
        { label: "Libertad Campus", href: "https://lc.antiquespride.edu.ph", external: true, description: "Libertad, Antique." },
        { label: "Caluya Campus", href: "https://www.antiquespride.edu.ph", external: true, description: "Caluya, Antique." },
        { label: "Hamtic Campus", href: "https://hc.antiquespride.edu.ph", external: true, description: "Hamtic, Antique." },
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

export const SETTING_ADMISSION_OPEN = "admission_open";
export const SETTING_APPLICATION_FEE = "application_fee";
