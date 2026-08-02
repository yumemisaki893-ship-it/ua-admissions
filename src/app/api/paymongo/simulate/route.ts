import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { isPayMongoConfigured } from "@/lib/paymongo";

/**
 * Development-only endpoint used when PayMongo is not configured.
 * Marks the application fee as paid (simulation) and redirects the
 * applicant back to the payment step of the wizard.
 */
export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, "paymongo-simulate");
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (isPayMongoConfigured()) {
    return NextResponse.json({ error: "Simulation is disabled in production mode." }, { status: 403 });
  }

  const checkoutId = req.nextUrl.searchParams.get("checkout_id");
  if (!checkoutId?.startsWith("sim_")) {
    return NextResponse.json({ error: "Invalid checkout id" }, { status: 400 });
  }

  const applicationId = checkoutId.slice("sim_".length);
  const application = await prisma.application.findUnique({ where: { id: applicationId } });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.application.update({
      where: { id: application.id },
      data: { applicationFeePaid: true },
    }),
    prisma.payment.upsert({
      where: { applicationId: application.id },
      create: {
        applicationId: application.id,
        amount: Number(process.env.APPLICATION_FEE_PHP ?? 500),
        status: "PAID",
        method: "simulated",
        paidAt: new Date(),
        paymongoId: checkoutId,
      },
      update: { status: "PAID", paidAt: new Date(), method: "simulated" },
    }),
  ]);

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${base}/portal/apply?step=5&payment=success`);
}
