import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { slugify } from "@/lib/utils";

export const externalLinkCategories = [
  "social",
  "seal",
  "quick",
  "campus",
  "career",
  "service",
  "nav",
] as const;

export type ExternalLinkCategory = (typeof externalLinkCategories)[number];

export interface ExternalLinkSeed {
  slug: string;
  label: string;
  url: string;
  category: string;
  description?: string;
  order?: number;
}

const services = [
  { label: "Health Services", url: "https://www.antiquespride.edu.ph/health-services/", description: "Medical and dental care for students." },
  { label: "Student Affairs & Services", url: "https://www.antiquespride.edu.ph/student-affairs-services-2/", description: "Guidance, discipline and student welfare." },
  { label: "Scholarship & Financial Assistance", url: "https://www.antiquespride.edu.ph/scholarship-and-financial-assistance-unit/", description: "Financial assistance and scholarship programs." },
  { label: "Library Services", url: "https://www.antiquespride.edu.ph/library-services/", description: "Learning resources and e-library access." },
  { label: "ICTU Helpdesk", url: "https://support.universityofantique.edu.ph", description: "Technical support and online tickets." },
  { label: "Document Request", url: "https://www.antiquespride.edu.ph/studentdocumentonlinerequest/", description: "Request transcripts and school documents." },
  { label: "Feedback & Complaints", url: "https://www.antiquespride.edu.ph/feedback/", description: "Send feedback, suggestions, or complaints." },
];

const campuses = [
  { label: "Tario Lim Memorial Campus", url: "https://tlmc.antiquespride.edu.ph", description: "Tobias Fornier, Antique" },
  { label: "Libertad Campus", url: "https://lc.antiquespride.edu.ph", description: "Libertad, Antique" },
  { label: "Caluya Campus", url: "https://www.antiquespride.edu.ph", description: "Caluya, Antique" },
  { label: "Hamtic Campus", url: "https://hc.antiquespride.edu.ph", description: "Hamtic, Antique" },
];

const careers = [
  { label: "Administrative Officer V (SG 18), Main Campus Sibalom", url: "https://www.antiquespride.edu.ph/we-are-hiring-18/" },
  { label: "Faculty — Filipino, College of Arts and Sciences (COS)", url: "https://www.antiquespride.edu.ph/we-are-hiring-17/" },
  { label: "Faculty — Hospitality Management and Criminology", url: "https://www.antiquespride.edu.ph/we-are-hiring-16/" },
];

const navExternal = [
  { label: "Transparency Seal", url: "https://antiquespride.edu.ph/ua-transparency-seal/" },
  { label: "Privacy Policy", url: "https://www.antiquespride.edu.ph/privacy-policy/" },
  { label: "Admission Portal", url: "https://sims.antiquespride.edu.ph/aims/application/" },
  { label: "Health Services", url: "https://www.antiquespride.edu.ph/health-services/" },
  { label: "Scholarships", url: "https://www.antiquespride.edu.ph/scholarship-and-financial-assistance-unit/" },
  { label: "Student Affairs & Services", url: "https://www.antiquespride.edu.ph/student-affairs-services-2/" },
  { label: "Library Services", url: "https://www.antiquespride.edu.ph/library-services/" },
  { label: "Tario Lim Memorial Campus", url: "https://tlmc.antiquespride.edu.ph" },
  { label: "Libertad Campus", url: "https://lc.antiquespride.edu.ph" },
  { label: "Caluya Campus", url: "https://www.antiquespride.edu.ph" },
  { label: "Hamtic Campus", url: "https://hc.antiquespride.edu.ph" },
];

export function defaultExternalLinks(): ExternalLinkSeed[] {
  const links: ExternalLinkSeed[] = [];
  let order = 0;

  for (const [key, url] of Object.entries(siteConfig.socials)) {
    links.push({ slug: `social-${key}`, label: key, url, category: "social", order: order++ });
  }

  links.push(
    { slug: "seal-transparency-seal", label: "Transparency Seal", url: "https://antiquespride.edu.ph/ua-transparency-seal/", category: "seal", order: order++ },
    { slug: "seal-bids-and-awards", label: "Bids and Awards", url: "https://antiquespride.edu.ph/bids-and-awards/", category: "seal", order: order++ },
    { slug: "seal-foi", label: "Freedom of Information", url: "https://www.foi.gov.ph/", category: "seal", order: order++ },
  );

  for (const group of Object.values(siteConfig.quickLinks)) {
    for (const item of group.items) {
      if (!item.href.startsWith("http")) continue;
      links.push({
        slug: `quick-${slugify(item.label)}`,
        label: item.label,
        url: item.href,
        category: "quick",
        order: order++,
      });
    }
  }

  for (const campus of campuses) {
    links.push({
      slug: `campus-${slugify(campus.label)}`,
      label: campus.label,
      url: campus.url,
      description: campus.description,
      category: "campus",
      order: order++,
    });
  }

  for (const career of careers) {
    links.push({
      slug: `career-${slugify(career.label)}`,
      label: career.label,
      url: career.url,
      description: "University of Antique · Hiring",
      category: "career",
      order: order++,
    });
  }

  for (const service of services) {
    links.push({
      slug: `service-${slugify(service.label)}`,
      label: service.label,
      url: service.url,
      description: service.description,
      category: "service",
      order: order++,
    });
  }

  for (const item of navExternal) {
    links.push({
      slug: `nav-${slugify(item.label)}`,
      label: item.label,
      url: item.url,
      category: "nav",
      order: order++,
    });
  }

  return links;
}

export async function seedExternalLinksIfNeeded(): Promise<void> {
  try {
    const count = await prisma.externalLink.count();
    if (count > 0) return;
    await prisma.externalLink.createMany({ data: defaultExternalLinks() });
  } catch {
    // DB unavailable — fall back to config defaults at the call sites.
  }
}

/** All active links as a slug → url lookup (used for per-item overrides). */
export async function getExternalLinks(category?: string): Promise<Record<string, string>> {
  await seedExternalLinksIfNeeded();
  try {
    const rows = await prisma.externalLink.findMany({
      where: { active: true, ...(category ? { category } : {}) },
      orderBy: [{ category: "asc" }, { order: "asc" }],
      select: { slug: true, url: true },
    });
    const map: Record<string, string> = {};
    for (const row of rows) map[row.slug] = row.url;
    return map;
  } catch {
    return {};
  }
}

export interface ExternalLinkRow {
  slug: string;
  label: string;
  url: string;
  description: string | null;
}

/** Full rows for a category (used where label/description matter, e.g. careers). */
export async function getExternalLinkRows(category: string): Promise<ExternalLinkRow[]> {
  await seedExternalLinksIfNeeded();
  try {
    return await prisma.externalLink.findMany({
      where: { active: true, category },
      orderBy: { order: "asc" },
      select: { slug: true, label: true, url: true, description: true },
    });
  } catch {
    return [];
  }
}

/** Resolve a single link with a config fallback. */
export function resolveLink(
  links: Record<string, string>,
  slug: string,
  fallback: string,
): string {
  return links[slug] ?? fallback;
}

export const linkSlug = (category: string, label: string) => `${category}-${slugify(label)}`;
