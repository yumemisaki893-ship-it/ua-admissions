import { PrismaClient, Role, NewsCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@universityofantique.edu.ph";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";

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
  {
    title: "COED students win national robotics tilt",
    slug: "coed-robotics-national-champions",
    category: NewsCategory.NEWS,
    excerpt:
      "A team of Information Technology students from the College of Engineering and Design bagged first place in the National Robotics Competition.",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "A four-member team from the BS Information Technology program of the College of Engineering and Design emerged as champions of the 2025 National Robotics Competition held in Manila.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The team's line-following robot, built from locally sourced parts, beat 40 other entries from across the country.",
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
          publishedAt: new Date(),
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
