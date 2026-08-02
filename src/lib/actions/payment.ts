"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createCheckoutSession, getApplicationFee } from "@/lib/paymongo";

export type PaymentCheckoutResult =
  | { ok: true; checkoutUrl: string; simulated: boolean }
  | { ok: false; error: string };

export async function createPaymentCheckout(): Promise<PaymentCheckoutResult> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "STUDENT") {
    return { ok: false as const, error: "You must be signed in as a student." };
  }

  const application = await prisma.application.findFirst({
    where: { userId: session.user.id, status: "DRAFT" },
    include: { studentProfile: true },
  });
  if (!application) return { ok: false as const, error: "No draft application found." };

  const fee = getApplicationFee();
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    const { checkoutUrl, checkoutId, simulated } = await createCheckoutSession({
      applicationId: application.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "UA Applicant",
      referenceNumber: application.referenceNumber ?? application.id,
      amount: fee,
      successUrl: `${baseUrl}/portal/apply?step=5&payment=success`,
      cancelUrl: `${baseUrl}/portal/apply?step=5&payment=cancelled`,
    });

    await prisma.application.update({
      where: { id: application.id },
      data: { paymongoCheckoutId: checkoutId },
    });

    return { ok: true, checkoutUrl, simulated };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Failed to create payment session.",
    };
  }
}

export async function paymentStatus() {
  const session = await auth();
  if (!session?.user?.id) return { paid: false };
  const application = await prisma.application.findFirst({
    where: { userId: session.user.id, status: "DRAFT" },
  });
  return { paid: application?.applicationFeePaid ?? false };
}
