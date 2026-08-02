import { PrismaClient, Role, NewsCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@universityofantique.edu.ph";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";
const ictuEmail = process.env.SEED_ICTU_EMAIL ?? "ictu@universityofantique.edu.ph";
const ictuPassword = process.env.SEED_ICTU_PASSWORD ?? "Ictu12345!";
const teacherEmail = process.env.SEED_TEACHER_EMAIL ?? "teacher@universityofantique.edu.ph";
const teacherPassword = process.env.SEED_TEACHER_PASSWORD ?? "Teacher12345!";
const studentEmail = process.env.SEED_STUDENT_EMAIL ?? "student@universityofantique.edu.ph";
const studentPassword = process.env.SEED_STUDENT_PASSWORD ?? "Student12345!";

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SeedCourse = {
  code: string;
  name: string;
  slug: string;
  durationYears: number;
  description: string;
  careerOpportunities: string[];
};

type SeedCollege = {
  code: string;
  name: string;
  slug: string;
  sortOrder: number;
  description: string;
  courses: SeedCourse[];
};

function course(code: string, name: string, opts?: { slug?: string; durationYears?: number; description?: string; careers?: string[] }): SeedCourse {
  return {
    code,
    name,
    slug: opts?.slug ?? slugifyName(name),
    durationYears: opts?.durationYears ?? 4,
    description: opts?.description ?? `${name} — a program offered by the University of Antique.`,
    careerOpportunities: opts?.careers ?? [],
  };
}

const colleges: SeedCollege[] = [
  {
    code: "CAS",
    name: "College of Arts and Sciences",
    slug: "college-of-arts-and-sciences",
    sortOrder: 1,
    description:
      "The CAS offers liberal arts, communication, language, and community development programs that build critical thinking and communication skills.",
    courses: [
      course("BA-PSYCH", "Bachelor of Arts in Psychology"),
      course("BA-COMM", "Bachelor of Arts in Communication"),
      course("BA-ELS", "Bachelor of Arts in English Language Studies"),
      course("BS-COMMDEV", "Bachelor of Science in Community Development"),
    ],
  },
  {
    code: "CMG",
    name: "College of Management and Governance",
    slug: "college-of-management-and-governance",
    sortOrder: 2,
    description:
      "The CMG produces ethical business leaders, accountants, hospitality and tourism professionals, and public administrators.",
    courses: [
      course("BSA", "Bachelor of Science in Accountancy", { careers: ["Certified Public Accountant", "External / Internal Auditor", "Financial Analyst", "Tax Consultant"] }),
      course("BSMA", "Bachelor of Science in Management Accounting"),
      course("BSHM", "Bachelor of Science in Hospitality Management"),
      course("BSTM", "Bachelor of Science in Tourism Management"),
      course("BSBA-MM", "Bachelor of Science in Business Administration major in Marketing Management"),
      course("BSOA", "Bachelor of Science in Office Administration"),
      course("BSENTREP", "Bachelor of Science in Entrepreneurship"),
      course("BSCM", "Bachelor of Science in Cooperatives Management"),
      course("DPA", "Doctor of Public Administration", { durationYears: 3 }),
      course("MBA", "Master of Business Administration", { durationYears: 2 }),
      course("MPA", "Master of Public Administration", { durationYears: 2 }),
    ],
  },
  {
    code: "CMS",
    name: "College of Maritime Studies",
    slug: "college-of-maritime-studies",
    sortOrder: 3,
    description:
      "The CMS trains licensed marine officers and engineers for the global maritime industry.",
    courses: [
      course("BSMARE", "Bachelor of Science in Marine Engineering"),
      course("BSMT", "Bachelor of Science in Marine Transportation"),
    ],
  },
  {
    code: "CIT",
    name: "College of Industrial Technology",
    slug: "college-of-industrial-technology",
    sortOrder: 4,
    description:
      "The CIT develops skilled technologists in automotive, electrical, electronics, drafting, food service, and related trades.",
    courses: [
      course("BIT-AT", "Bachelor in Industrial Technology – Automotive Technology"),
      course("BIT-ET", "Bachelor in Industrial Technology – Electrical Technology"),
      course("BIT-ECT", "Bachelor in Industrial Technology – Electronics Technology"),
      course("BIT-FDAT", "Bachelor in Industrial Technology – Fashion Design and Apparel Technology"),
      course("BIT-FST", "Bachelor in Industrial Technology – Food Service Technology"),
      course("BIT-HVACR", "Bachelor in Industrial Technology – Heating, Ventilating, Air Conditioning and Refrigeration Technology"),
      course("BIT-DT", "Bachelor in Industrial Technology – Drafting Technology"),
      course("BIT-CCT", "Bachelor in Industrial Technology – Civil and Construction Technology"),
      course("TESDA-ELEC", "TESDA Leverage Program Electricity", { durationYears: 2 }),
    ],
  },
  {
    code: "LHS",
    name: "Laboratory High School",
    slug: "laboratory-high-school",
    sortOrder: 5,
    description:
      "The University of Antique Laboratory High School offers junior high school education, including the Science, Technology and Engineering (STE) curriculum.",
    courses: [
      course("JHS-REG", "Junior High School – Regular", { durationYears: 4 }),
      course("JHS-STE", "Junior High School – STE", { durationYears: 4 }),
    ],
  },
  {
    code: "CCJE",
    name: "College of Criminal Justice and Education",
    slug: "college-of-criminal-justice-and-education",
    sortOrder: 6,
    description:
      "The CCJE prepares students for careers in law enforcement, criminology, and industrial security management.",
    courses: [
      course("BSCRIM", "Bachelor of Science in Criminology", { careers: ["Criminologist", "Police Officer", "Correctional Officer", "Security Management Professional"] }),
      course("BSISM", "Bachelor of Science in Industrial Security Management"),
    ],
  },
  {
    code: "COEA",
    name: "College of Engineering and Architecture",
    slug: "college-of-engineering-and-architecture",
    sortOrder: 7,
    description:
      "The COEA offers accredited engineering and architecture programs that answer the demands of industry and infrastructure.",
    courses: [
      course("BSCE", "Bachelor of Science in Civil Engineering", { durationYears: 5, careers: ["Civil Engineer", "Structural Engineer", "Project Manager", "Construction Supervisor"] }),
      course("BSME", "Bachelor of Science in Mechanical Engineering", { durationYears: 5 }),
      course("BSEE", "Bachelor of Science in Electrical Engineering", { durationYears: 5 }),
      course("BSECE", "Bachelor of Science in Electronics Engineering", { durationYears: 5 }),
      course("BSCPE", "Bachelor of Science in Computer Engineering", { durationYears: 5 }),
      course("BSARCH", "Bachelor of Science in Architecture", { durationYears: 5 }),
    ],
  },
  {
    code: "CCIS",
    name: "College of Computing and Information Sciences",
    slug: "college-of-computing-and-information-sciences",
    sortOrder: 8,
    description:
      "The CCIS offers computing programs covering software development, networking, cybersecurity, and library information science.",
    courses: [
      course("BSCS", "Bachelor of Science in Computer Science", { careers: ["Software Engineer", "Systems Analyst", "Data Scientist", "Cybersecurity Analyst"] }),
      course("BLIS", "Bachelor in Library and Information Science"),
      course("BSIT", "Bachelor of Science in Information Technology", { careers: ["Software Engineer", "Web Developer", "Network Administrator", "IT Project Manager"] }),
    ],
  },
  {
    code: "CTE",
    name: "College of Teacher Education",
    slug: "college-of-teacher-education",
    sortOrder: 9,
    description:
      "The CTE forms competent teachers and technical-vocational educators for elementary, secondary, and special needs education.",
    courses: [
      course("BEED", "Bachelor of Elementary Education"),
      course("BECED", "Bachelor in Early Childhood Education"),
      course("BPED", "Bachelor of Physical Education"),
      course("BSED-ENG", "Bachelor of Secondary Education – English"),
      course("BSED-FIL", "Bachelor of Secondary Education – Filipino"),
      course("BSED-SCI", "Bachelor of Secondary Education – Science"),
      course("BSED-SS", "Bachelor of Secondary Education – Social Studies"),
      course("BSED-MATH", "Bachelor of Secondary Education – Mathematics"),
      course("BSNED-GEN", "Bachelor of Special Needs Education – Generalist"),
      course("BTVTED-AT", "Bachelor of Technical-Vocational Teacher Education – Automotive Technology"),
      course("BTVTED-ET", "Bachelor of Technical-Vocational Teacher Education – Electrical Technology"),
      course("BTVTED-ECT", "Bachelor of Technical-Vocational Teacher Education – Electronics Technology"),
      course("BTVTED-FSM", "Bachelor of Technical-Vocational Teacher Education – Food and Service Management"),
      course("BTVTED-GFD", "Bachelor of Technical-Vocational Teacher Education – Garments, Fashion and Design"),
      course("BTVTED-HVAC", "Bachelor of Technical-Vocational Teacher Education – Heating, Ventilation, and Air-Conditioning Technology"),
      course("BTVTED-DT", "Bachelor of Technical-Vocational Teacher Education – Drafting Technology"),
      course("BTVTED-CCT", "Bachelor of Technical-Vocational Teacher Education – Civil Construction Technology"),
      course("DIP-TEACH", "Diploma in Teaching", { durationYears: 2 }),
      course("CERT-TEACH", "Certificate in Teaching", { durationYears: 2 }),
      course("PHD-EDM", "Doctor of Philosophy – Educational Management", { durationYears: 3 }),
      course("MAED-ENG", "Master of Arts in Education – English", { durationYears: 2 }),
      course("MAED-FIL", "Master of Arts in Education – Filipino", { durationYears: 2 }),
      course("MAED-SS", "Master of Arts in Education – Social Studies", { durationYears: 2 }),
      course("MAED-MATH", "Master of Arts in Education – Mathematics", { durationYears: 2 }),
      course("MAED-SCI", "Master of Arts in Education – Science", { durationYears: 2 }),
      course("MAED-CI", "Master of Arts in Education – Curriculum Instruction", { durationYears: 2 }),
      course("MED-EDM", "Master in Education – Educational Management", { durationYears: 2 }),
      course("MED-CD", "Master in Education – Curriculum Development", { durationYears: 2 }),
    ],
  },
  {
    code: "HAMTIC",
    name: "UA Hamtic Campus",
    slug: "ua-hamtic-campus",
    sortOrder: 10,
    description:
      "The UA Hamtic Campus offers agriculture, forestry, food technology, and teacher education programs.",
    courses: [
      course("BSED-ENG-H", "Bachelor of Secondary Education – English", { slug: "bsed-english-hamtic" }),
      course("BSCS-H", "Bachelor of Science in Computer Science", { slug: "bs-cs-hamtic" }),
      course("BSAG-AS", "Bachelor of Science in Agriculture – Animal Science", { slug: "bs-agriculture-animal-science" }),
      course("BSAG-CS", "Bachelor of Science in Agriculture – Crop Science", { slug: "bs-agriculture-crop-science" }),
      course("BSFT", "Bachelor of Science in Food Technology", { slug: "bs-food-technology" }),
      course("BSF", "Bachelor of Science in Forestry", { slug: "bs-forestry" }),
      course("BTLED-HE", "Bachelor of Technology and Livelihood Education – Home Economics"),
      course("BTLED-AFA", "Bachelor of Technology and Livelihood Education – Agri-Fishery Arts"),
      course("BSDT", "Bachelor of Dairy Technology", { slug: "bs-dairy-technology" }),
    ],
  },
  {
    code: "TLMC",
    name: "UA TLMC Campus",
    slug: "ua-tlmc-campus",
    sortOrder: 11,
    description:
      "The UA Tario Lim Memorial Campus offers business, computing, teacher education, fisheries, and environmental management programs.",
    courses: [
      course("BSENTREP-T", "Bachelor of Science in Entrepreneurship (CBM)", { slug: "bs-entrepreneurship-tlmc" }),
      course("BSHM-T", "Bachelor of Science in Hospitality Management (CBM)", { slug: "bs-hospitality-tlmc" }),
      course("BSCS-T", "Bachelor of Science in Computer Science (CCS)", { slug: "bs-cs-tlmc" }),
      course("BSIT-T", "Bachelor of Science in Information Technology (CCS)", { slug: "bsit-tlmc" }),
      course("BSIS-T", "Bachelor of Science in Information System (CCS)", { slug: "bs-information-systems-tlmc" }),
      course("BEED-T", "Bachelor of Elementary Education (CTE)", { slug: "beed-tlmc" }),
      course("BSED-ENG-T", "Bachelor of Secondary Education – English (CTE)", { slug: "bsed-english-tlmc" }),
      course("BSED-MATH-T", "Bachelor of Secondary Education – Mathematics (CTE)", { slug: "bsed-math-tlmc" }),
      course("BSED-SCI-T", "Bachelor of Secondary Education – Science (CTE)", { slug: "bsed-science-tlmc" }),
      course("BSLGA-EM", "Bachelor of Local Government Administration – Environmental Management"),
      course("BSFISH-T", "Bachelor of Science in Fisheries (CFE)", { slug: "bs-fisheries-tlmc" }),
      course("CERT-TEACH-T", "Certificate in Teaching (CTE)", { slug: "certificate-teaching-tlmc", durationYears: 2 }),
      course("MED-EDM-T", "Master in Education – Educational Management (CTE)", { slug: "med-edm-tlmc", durationYears: 2 }),
    ],
  },
  {
    code: "LIBERTAD",
    name: "UA Libertad Campus",
    slug: "ua-libertad-campus",
    sortOrder: 12,
    description:
      "The UA Libertad Campus offers information technology and hospitality management programs.",
    courses: [
      course("BSIT-L", "Bachelor of Science in Information Technology", { slug: "bsit-libertad" }),
      course("BSHM-L", "Bachelor of Science in Hospitality Management", { slug: "bshm-libertad" }),
    ],
  },
  {
    code: "CALUYA",
    name: "UA Caluya Campus",
    slug: "ua-caluya-campus",
    sortOrder: 13,
    description:
      "The UA Caluya Campus offers entrepreneurship, hospitality management, and industrial technology programs.",
    courses: [
      course("BSENTREP-C", "Bachelor of Science in Entrepreneurship", { slug: "bs-entrep-caluya" }),
      course("BSHM-C", "Bachelor of Science in Hospitality Management", { slug: "bshm-caluya" }),
      course("BIT-ET-C", "Bachelor in Industrial Technology – Electrical Technology", { slug: "bit-electrical-caluya" }),
      course("BIT-FST-C", "Bachelor in Industrial Technology – Food Service Technology", { slug: "bit-food-service-caluya" }),
    ],
  },
];


const news = [
  {
    title: "UA Receives Citation of Merit for Excellence in Disaster Resilience",
    slug: "ua-receives-citation-of-merit-for-excellence-in-disaster-resilience",
    category: NewsCategory.NEWS,
    excerpt:
      "The Province of Antique and the Office of the Provincial Disaster Risk Reduction and Management Officer (OPDRRMO) Antique conferred a Citation of Merit to the University of Antique during the awarding ceremony.",
    imageUrl: "/ua/news/resilience-citation.png",
    publishedAt: new Date("2026-07-29T15:55:54+08:00"),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The Province of Antique and the Office of the Provincial Disaster Risk Reduction and Management Officer (OPDRRMO) Antique conferred a Citation of Merit to the University of Antique during the ceremony held in recognition of the University's outstanding contribution to disaster risk reduction and management.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "UA Joins SWD L-Net Partnership",
    slug: "ua-joins-swd-l-net-partnership",
    category: NewsCategory.NEWS,
    excerpt:
      "The University of Antique, under the leadership of University President Dr. Godelyn G. Hisole, formally joined the Social Welfare and Development Learning Network (SWD L-Net) through the signing of a memorandum of partnership.",
    imageUrl: "/ua/news/swd-lnet.jpg",
    publishedAt: new Date("2026-07-27T13:51:33+08:00"),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The University of Antique, under the leadership of University President Dr. Godelyn G. Hisole, formally joined the Social Welfare and Development Learning Network (SWD L-Net) through the signing of a memorandum of partnership, strengthening its commitment to community empowerment and social development.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "UA Educators Win Best Paper Awards at EDSUM 2026",
    slug: "ua-educators-win-best-paper-awards-at-edsum-2026",
    category: NewsCategory.NEWS,
    excerpt:
      "Congratulations to our faculty members, Dr. Isah Lou G. Nocal and Dr. Sheila D. Delgado, for bagging the Best Paper Award in their respective category during the Education Summit 2026 (EDSUM 2026).",
    imageUrl: "/ua/news/edsum-best-paper.jpg",
    publishedAt: new Date("2026-07-27T10:00:00+08:00"),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Congratulations to our faculty members, Dr. Isah Lou G. Nocal and Dr. Sheila D. Delgado, for bagging the Best Paper Award in their respective category during the Education Summit 2026 (EDSUM 2026). The University commends their exemplary contribution to research and education.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "UA Joins DSWD in Releasing Livelihood Grant to Patnongon SLPA",
    slug: "ua-joins-dswd-in-releasing-livelihood-grant-to-patnongon-slpa",
    category: NewsCategory.NEWS,
    excerpt:
      "Strengthening its commitment to community empowerment through meaningful partnerships, the University of Antique joined the Department of Social Welfare and Development in releasing a livelihood grant to a Sustainable Livelihood Program Association in Patnongon.",
    imageUrl: "/ua/news/dswd-slpa.jpg",
    publishedAt: new Date("2026-07-24T10:00:00+08:00"),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Strengthening its commitment to community empowerment through meaningful partnerships, the University of Antique (UA) joined the Department of Social Welfare and Development – Sustainable Livelihood Program in releasing a livelihood grant to the Patnongon SLPA.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "UA Celebrates Reappointment of Dr. Shirley Agrupis as CHED Chairperson",
    slug: "ua-celebrates-reappointment-of-dr-shirley-agrupis-as-ched-chairperson",
    category: NewsCategory.NEWS,
    excerpt:
      "Congratulations, Dr. Shirley C. Agrupis, on your Reappointment as CHED Chairperson! The entire University of Antique joins the Commission on Higher Education in celebrating your reappointment.",
    imageUrl: "/ua/news/ched-chair.png",
    publishedAt: new Date("2026-07-23T10:00:00+08:00"),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Congratulations, Dr. Shirley C. Agrupis, on your Reappointment as CHED Chairperson! The entire University of Antique joins the Commission on Higher Education in celebrating your reappointment.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Enrollment Schedule for S.Y. 2026–2027",
    slug: "enrollment-schedule-sy-2026-2027",
    category: NewsCategory.ANNOUNCEMENT,
    excerpt:
      "August is about to slip in… and so is enrollment season! Here is the Enrollment Schedule for S.Y. 2026–2027 for continuing students.",
    imageUrl: "/ua/news/enrollment.png",
    publishedAt: new Date("2026-07-29T15:35:32+08:00"),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "August is about to slip in… and so is enrollment season! Kasubay, get ready to embark on another exciting school year. Here is the Enrollment Schedule for S.Y. 2026–2027. Continuing students, please take note of the schedule released by the University.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "WE ARE HIRING! — Administrative Officer V",
    slug: "we-are-hiring-admin-officer-v",
    category: NewsCategory.ANNOUNCEMENT,
    excerpt:
      "University of Antique – Main Campus in Sibalom is in need of an Administrative Officer V (SG 18). Interested and qualified applicants, which include persons with disability (PWD), may apply.",
    imageUrl: "/ua/news/hiring.png",
    publishedAt: new Date("2026-06-30T10:00:00+08:00"),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "University of Antique – Main Campus in Sibalom is in need of an Administrative Officer V (SG 18). Interested and qualified applicants, which include persons with disability (PWD) and members of indigenous communities, are encouraged to apply.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "University of Antique opens applications for AY 2026-2027",
    slug: "ua-opens-applications-2026",
    category: NewsCategory.ANNOUNCEMENT,
    excerpt:
      "Online applications for the first semester of Academic Year 2026-2027 are now open. Submit your application through the UA Student Portal.",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The University of Antique is now accepting applications for the First Semester of Academic Year 2026-2027. All applications are processed online through the University's Student Portal.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Applicants must prepare the following documents:",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "PSA Birth Certificate" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Form 137 (High School Records)" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "2x2 ID picture (white background)" }] }] },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "For inquiries, please contact the Office of Admissions at admissions@universityofantique.edu.ph.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "UA celebrates Foundation Day with week-long festivities",
    slug: "ua-foundation-day-festivities",
    category: NewsCategory.EVENT,
    excerpt:
      "Join us for a week of sports, cultural shows, and academic conferences celebrating the founding of the University of Antique.",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The University of Antique commemorates its founding with a week-long celebration featuring inter-college sports competitions, cultural presentations, and academic conferences.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The grand parade will be held on campus on the opening day, followed by the annual Mr. and Ms. UA pageant and the Inter-College Cheerleading Competition.",
            },
          ],
        },
      ],
    },
  },
];

const aboutContent = {
  history: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The University of Antique traces its roots to 1954 when it was established as the Antique School of Arts and Trades (ASAT). Through the years it evolved — becoming the Antique National School, then the Panay State Polytechnic College, and finally the University of Antique in 2010 by virtue of Republic Act No. 9970.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Today, the University of Antique is a Level IV SUC with campuses across the province of Antique, offering programs in education, business, engineering, information technology, arts and sciences, agriculture, and nursing.",
          },
        ],
      },
    ],
  },
  vision:
    "A research-led university producing globally competitive graduates and sustainable innovations by 2030.",
  mission:
    "The University of Antique provides relevant, accessible, and quality higher education; advances knowledge through research; and responds to the needs of the community through extension and production services.",
  hymn: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hail University of Antique," }] },
      { type: "paragraph", content: [{ type: "text", text: "Alma mater we love dear," }] },
      { type: "paragraph", content: [{ type: "text", text: "Thy name we shall uphold," }] },
      { type: "paragraph", content: [{ type: "text", text: "With honor, faith and cheer." }] },
    ],
  },
  sealDescription: "The official seal of the University of Antique.",
};

async function main() {
  console.log("Seeding database...");

  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        name: "UA Administrator",
        role: Role.SUPER_ADMIN,
        isVerified: true,
      },
    });
    console.log(`Created admin user: ${adminEmail}`);
  }

  const ictuExists = await prisma.user.findUnique({ where: { email: ictuEmail } });
  if (!ictuExists) {
    await prisma.user.create({
      data: {
        email: ictuEmail,
        passwordHash: await bcrypt.hash(ictuPassword, 12),
        name: "ICTU Administrator",
        role: Role.ICTU_SUPERVISOR,
        isVerified: true,
        isActive: true,
      },
    });
    console.log(`Created ICTU user: ${ictuEmail}`);
  }

  const teacherExists = await prisma.user.findUnique({ where: { email: teacherEmail } });
  if (!teacherExists) {
    await prisma.user.create({
      data: {
        email: teacherEmail,
        passwordHash: await bcrypt.hash(teacherPassword, 12),
        name: "Demo Faculty",
        role: Role.TEACHER,
        isVerified: true,
        isActive: true,
      },
    });
    console.log(`Created teacher user: ${teacherEmail}`);
  }

  const studentExists = await prisma.user.findUnique({ where: { email: studentEmail } });
  let studentProfile: { id: string; userId: string } | null = null;
  if (!studentExists) {
    const created = await prisma.user.create({
      data: {
        email: studentEmail,
        passwordHash: await bcrypt.hash(studentPassword, 12),
        name: "Demo Student",
        role: Role.STUDENT,
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            studentNumber: "UA-2026-0001",
            firstName: "Demo",
            lastName: "Student",
            gender: "Prefer not to say",
            birthDate: new Date("2004-01-01"),
            address: "Sibalom, Antique",
            city: "Sibalom",
            province: "Antique",
            contactNumber: "09123456789",
            guardianName: "Demo Guardian",
          },
        },
      },
    });
    studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: created.id },
      select: { id: true, userId: true },
    });
    console.log(`Created student user: ${studentEmail}`);
  } else {
    studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentExists.id },
      select: { id: true, userId: true },
    });
  }

  const firstCollege = await prisma.college.findFirst();
  if (firstCollege) {
    const subjects: { code: string; title: string; units: number }[] = [
      { code: "CC101", title: "Programming Fundamentals", units: 3 },
      { code: "MATH101", title: "College Algebra", units: 3 },
    ];
    for (const s of subjects) {
      const exists = await prisma.subject.findUnique({ where: { code: s.code } });
      if (!exists) {
        await prisma.subject.create({
          data: { code: s.code, title: s.title, units: s.units, collegeId: firstCollege.id },
        });
        console.log(`Created subject: ${s.code}`);
      }
    }

    const teacher = await prisma.user.findUnique({ where: { email: teacherEmail } });
    if (teacher && studentProfile) {
      const math = await prisma.subject.findUnique({ where: { code: "MATH101" } });
      if (math) {
        const existingClass = await prisma.class.findFirst({
          where: { teacherId: teacher.id, subjectId: math.id, section: "BSIT-1A", academicYear: "2026-2027", semester: "1st Semester" },
        });
        if (!existingClass) {
          const created = await prisma.class.create({
            data: {
              subjectId: math.id,
              teacherId: teacher.id,
              section: "BSIT-1A",
              semester: "1st Semester",
              academicYear: "2026-2027",
              schedule: "MWF 9:00–10:30 AM",
              room: "Rm. 204",
            },
          });
          await prisma.enrollment.create({
            data: { classId: created.id, studentProfileId: studentProfile.id },
          });
          console.log("Created demo class + enrolled demo student");
        }
      }
    }
  }

  for (const college of colleges) {
    const existing = await prisma.college.findUnique({ where: { code: college.code } });
    const savedCollege =
      existing ??
      (await prisma.college.create({
        data: {
          code: college.code,
          name: college.name,
          slug: college.slug,
          sortOrder: college.sortOrder,
          description: college.description,
        },
      }));

    for (const course of college.courses) {
      const exists = await prisma.course.findUnique({ where: { slug: course.slug } });
      if (!exists) {
        await prisma.course.create({
          data: {
            collegeId: savedCollege.id,
            code: course.code,
            name: course.name,
            slug: course.slug,
            durationYears: course.durationYears,
            description: course.description,
            careerOpportunities: course.careerOpportunities,
            curriculum: {
              type: "doc",
              content: [
                { type: "paragraph", content: [{ type: "text", text: `Curriculum details for ${course.name} are published by the Registrar's Office.` }] },
              ],
            },
          },
        });
        console.log(`Created course: ${course.code} - ${course.name}`);
      }
    }
  }

  for (const item of news) {
    const exists = await prisma.news.findUnique({ where: { slug: item.slug } });
    if (!exists) {
      await prisma.news.create({
        data: {
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          category: item.category,
          published: true,
          publishedAt: item.publishedAt ?? new Date(),
          imageUrl: item.imageUrl ?? null,
        },
      });
    }
  }

  const contentKeys = [
    { key: "about_history", title: "About - History", content: aboutContent.history },
    { key: "about_vision", title: "About - Vision", content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: aboutContent.vision }] }] } },
    { key: "about_mission", title: "About - Mission", content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: aboutContent.mission }] }] } },
    { key: "about_hymn", title: "About - Hymn", content: aboutContent.hymn },
    { key: "about_seal", title: "About - Seal", content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: aboutContent.sealDescription }] }] } },
  ];
  for (const c of contentKeys) {
    const exists = await prisma.siteContent.findUnique({ where: { key: c.key } });
    if (!exists) {
      await prisma.siteContent.create({ data: c });
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
