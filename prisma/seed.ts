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

const colleges = [
  {
    code: "CAS",
    name: "College of Arts and Sciences",
    slug: "college-of-arts-and-sciences",
    sortOrder: 1,
    description:
      "The CAS offers liberal arts, humanities, social sciences and natural sciences programs that build critical thinking and communication skills.",
    courses: [
      {
        code: "BA-COMM",
        name: "Bachelor of Arts in Communication",
        slug: "ba-communication",
        durationYears: 4,
        description:
          "A program that develops competent communicators for media, corporate communication, and public relations careers.",
        careerOpportunities: [
          "Journalist / Reporter",
          "Public Relations Officer",
          "Corporate Communication Specialist",
          "Broadcast Producer",
          "Social Media Manager",
        ],
      },
      {
        code: "BS-PSYCH",
        name: "Bachelor of Science in Psychology",
        slug: "bs-psychology",
        durationYears: 4,
        description:
          "Prepares students for careers in human services, organizational psychology, and graduate study in psychology.",
        careerOpportunities: [
          "HR Specialist",
          "Guidance Assistant",
          "Psychometrician (with licensure)",
          "Case Manager",
          "Research Assistant",
        ],
      },
      {
        code: "BS-BIO",
        name: "Bachelor of Science in Biology",
        slug: "bs-biology",
        durationYears: 4,
        description:
          "A strong science foundation for careers in health professions, research, and environmental science.",
        careerOpportunities: [
          "Medical / Allied Health Professional (with further study)",
          "Microbiologist",
          "Environmental Analyst",
          "Science Teacher",
          "Research Scientist",
        ],
      },
    ],
  },
  {
    code: "CBA",
    name: "College of Business and Accountancy",
    slug: "college-of-business-and-accountancy",
    sortOrder: 2,
    description:
      "CBA produces ethical business leaders and accountants through its Accountancy and Business Administration programs.",
    courses: [
      {
        code: "BSA",
        name: "Bachelor of Science in Accountancy",
        slug: "bs-accountancy",
        durationYears: 4,
        description:
          "A rigorous program that prepares students for the Certified Public Accountant (CPA) licensure examination.",
        careerOpportunities: [
          "Certified Public Accountant",
          "External / Internal Auditor",
          "Financial Analyst",
          "Tax Consultant",
          "Chief Financial Officer",
        ],
      },
      {
        code: "BSBA-MKT",
        name: "BS in Business Administration major in Marketing Management",
        slug: "bsba-marketing",
        durationYears: 4,
        description:
          "Focuses on marketing strategy, consumer behavior, digital marketing, and brand management.",
        careerOpportunities: [
          "Marketing Manager",
          "Brand Strategist",
          "Sales Director",
          "Digital Marketing Specialist",
          "Entrepreneur",
        ],
      },
      {
        code: "BSBA-FIN",
        name: "BS in Business Administration major in Financial Management",
        slug: "bsba-finance",
        durationYears: 4,
        description:
          "Equips students with corporate finance, investment, and banking skills.",
        careerOpportunities: [
          "Financial Analyst",
          "Investment Banker",
          "Bank Officer",
          "Credit Analyst",
          "Treasury Specialist",
        ],
      },
      {
        code: "BSAIS",
        name: "Bachelor of Science in Accounting Information Systems",
        slug: "bs-accounting-information-systems",
        durationYears: 4,
        description:
          "The intersection of accounting, information systems, and data analytics.",
        careerOpportunities: [
          "Systems Auditor",
          "IT Consultant",
          "Data Analyst",
          "ERP Specialist",
          "Cybersecurity Analyst",
        ],
      },
    ],
  },
  {
    code: "COE",
    name: "College of Education",
    slug: "college-of-education",
    sortOrder: 3,
    description:
      "The COE trains future teachers who shape the next generation of Filipino learners.",
    courses: [
      {
        code: "BEED",
        name: "Bachelor of Elementary Education",
        slug: "beed",
        durationYears: 4,
        description:
          "Prepares students to teach in elementary schools with strong pedagogical foundations.",
        careerOpportunities: [
          "Elementary School Teacher",
          "Learning Facilitator",
          "Curriculum Developer",
          "Special Education Teacher (with specialization)",
          "School Administrator",
        ],
      },
      {
        code: "BSED-ENG",
        name: "BS Secondary Education major in English",
        slug: "bsed-english",
        durationYears: 4,
        description:
          "Develops secondary school English teachers with mastery of language and literature.",
        careerOpportunities: [
          "Secondary School Teacher",
          "ESL Instructor",
          "Language Editor",
          "Instructional Designer",
          "Education Program Supervisor",
        ],
      },
      {
        code: "BSED-MATH",
        name: "BS Secondary Education major in Mathematics",
        slug: "bsed-math",
        durationYears: 4,
        description:
          "Trains future mathematics educators for secondary education.",
        careerOpportunities: [
          "Secondary Math Teacher",
          "Academic Coach",
          "Educational Statistician",
          "Curriculum Specialist",
          "Tutorial Center Manager",
        ],
      },
    ],
  },
  {
    code: "COED",
    name: "College of Engineering and Design",
    slug: "college-of-engineering-and-design",
    sortOrder: 4,
    description:
      "COED offers engineering and technology programs that answer the demands of industry and infrastructure.",
    courses: [
      {
        code: "BSIT",
        name: "Bachelor of Science in Information Technology",
        slug: "bsit",
        durationYears: 4,
        description:
          "A program covering software development, networking, cybersecurity, and database systems.",
        careerOpportunities: [
          "Software Engineer",
          "Web Developer",
          "Network Administrator",
          "Cybersecurity Analyst",
          "Database Administrator",
          "IT Project Manager",
        ],
      },
      {
        code: "BSCE",
        name: "Bachelor of Science in Civil Engineering",
        slug: "bs-civil-engineering",
        durationYears: 5,
        description:
          "Designs and manages infrastructure: roads, bridges, buildings, and water systems.",
        careerOpportunities: [
          "Civil Engineer",
          "Structural Engineer",
          "Project Manager",
          "Construction Supervisor",
          "Urban Planner",
        ],
      },
      {
        code: "BSECE",
        name: "Bachelor of Science in Electronics Engineering",
        slug: "bs-electronics-engineering",
        durationYears: 5,
        description:
          "Focuses on electronic systems, communications, and embedded technologies.",
        careerOpportunities: [
          "Electronics Engineer",
          "Telecommunications Engineer",
          "Embedded Systems Developer",
          "RF Engineer",
          "Semiconductor Engineer",
        ],
      },
    ],
  },
  {
    code: "CON",
    name: "College of Nursing",
    slug: "college-of-nursing",
    sortOrder: 5,
    description:
      "CON forms compassionate and competent professional nurses for local and international healthcare.",
    courses: [
      {
        code: "BSN",
        name: "Bachelor of Science in Nursing",
        slug: "bsn",
        durationYears: 4,
        description:
          "A program that integrates nursing science, clinical practice, and community health.",
        careerOpportunities: [
          "Registered Nurse",
          "Clinical Nurse Specialist (with further study)",
          "Nurse Educator",
          "Public Health Nurse",
          "Overseas Nurse",
        ],
      },
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
