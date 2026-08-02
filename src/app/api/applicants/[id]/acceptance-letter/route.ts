import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "REGISTRAR", "ADMISSIONS_OFFICER"];

/**
 * Generates a PDF acceptance letter for a qualified applicant.
 * Only accessible to staff roles (Super Admin, Registrar, Admissions Officer).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || !ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      studentProfile: true,
      course: { include: { college: true } },
      user: true,
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const accepted = application.status === "ACCEPTED";
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const page = pdf.addPage([612, 792]); // US Letter
  const { width, height } = page.getSize();
  const margin = 56;
  const contentWidth = width - margin * 2;

  const skyBlue = rgb(0.03, 0.52, 0.78);
  const navy = rgb(0.04, 0.11, 0.24);
  const darkGray = rgb(0.28, 0.32, 0.38);
  const black = rgb(0.1, 0.1, 0.1);

  let y = height - 80;

  // Letterhead
  page.drawRectangle({ x: 0, y: height - 12, width, height: 12, color: skyBlue });
  page.drawText("UNIVERSITY OF ANTIQUE", { x: margin, y, size: 18, font: bold, color: navy });
  y -= 16;
  page.drawText("Sibalom, Antique, Philippines", { x: margin, y, size: 10, font, color: darkGray });
  y -= 14;
  page.drawText("Office of the Registrar", { x: margin, y, size: 10, font, color: darkGray });
  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1.5, color: skyBlue });
  y -= 40;

  // Title
  const title = accepted ? "LETTER OF ACCEPTANCE" : "LETTER OF RESPONSE";
  page.drawText(title, { x: width / 2 - font.widthOfTextAtSize(title, 14) / 2, y, size: 14, font: bold, color: navy });
  y -= 40;

  // Date
  page.drawText(formatDate(new Date()), { x: margin, y, size: 10, font, color: black });
  y -= 24;

  const applicantName = [
    application.studentProfile.firstName,
    application.studentProfile.middleName,
    application.studentProfile.lastName,
    application.studentProfile.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const lines = accepted
    ? [
        `Dear ${applicantName},`,
        "",
        `Congratulations! You have been accepted to the ${application.course.name} (${application.course.code}) program of the ${application.course.college.name} for the upcoming academic year.`,
        "",
        `Your application reference number is ${application.referenceNumber}.`,
        "",
        "Please proceed to the Office of the Registrar to complete your enrollment requirements within the prescribed schedule. Bring the following:",
      ]
    : [
        `Dear ${applicantName},`,
        "",
        "Thank you for your interest in the University of Antique.",
        "",
        `After careful evaluation of your application (Reference No. ${application.referenceNumber ?? "N/A"}), we regret to inform you that we are unable to offer you admission to the ${application.course.name} (${application.course.code}) program at this time.`,
        "",
        "You may apply again for the next admission cycle, or explore other programs offered by the University.",
      ];

  for (const line of lines) {
    if (line === "") {
      y -= 12;
      continue;
    }
    const wrapped = wrapText(line, font, 10, contentWidth - 10);
    for (const part of wrapped) {
      page.drawText(part, { x: margin, y, size: 10, font, color: black });
      y -= 14;
    }
  }

  if (accepted) {
    y -= 6;
    for (const item of [
      "1. PSA Birth Certificate (original)",
      "2. Form 137 / Report Card (original)",
      "3. Two (2) pieces of 2x2 ID pictures",
    ]) {
      page.drawText(item, { x: margin + 12, y, size: 10, font, color: black });
      y -= 14;
    }
    y -= 10;
    page.drawText("We look forward to welcoming you to the University of Antique!", {
      x: margin,
      y,
      size: 10,
      font: bold,
      color: navy,
    });
  }

  y = 96;
  page.drawText("Warm regards,", { x: margin, y, size: 10, font, color: black });
  y -= 44;
  page.drawText("DR. JUAN C. MIGUEL", { x: margin, y, size: 11, font: bold, color: navy });
  y -= 14;
  page.drawText("University Registrar", { x: margin, y, size: 10, font, color: darkGray });

  // Footer
  page.drawLine({ start: { x: margin, y: 48 }, end: { x: width - margin, y: 48 }, thickness: 0.5, color: skyBlue });
  page.drawText(`University of Antique · ${application.referenceNumber ?? application.id}`, {
    x: margin,
    y: 38,
    size: 8,
    font,
    color: darkGray,
  });

  const bytes = await pdf.save();

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="UA-${accepted ? "Acceptance" : "Response"}-${(application.referenceNumber ?? application.id).replace(/\//g, "-")}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

function wrapText(text: string, font: { widthOfTextAtSize: (t: string, s: number) => number }, size: number, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
