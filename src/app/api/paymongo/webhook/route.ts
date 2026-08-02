import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { verifyWebhookSignature } from "@/lib/paymongo";

export const dynamic = "force-dynamic";

/**
 * PayMongo webhook endpoint.
 * Verifies the HMAC signature, then marks the matching application fee
 * as paid when a checkout session succeeds.
 */
export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, "paymongo-webhook");
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("paymongo-signature");
  const event = JSON.parse(rawBody) as {
    data?: {
      id?: string;
      attributes?: {
        type?: string;
        data?: {
          id?: string;
          attributes?: { status?: string; payment_intent?: { id?: string }; reference_number?: string };
        };
      };
    };
  };

  const evt = event?.data?.attributes;

  if (evt?.type === "checkout_session.payment.paid" || evt?.type === "payment.paid") {
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const checkoutId =
      evt?.data?.id ?? evt?.data?.attributes?.payment_intent?.id ?? "unknown";

    await prisma.$transaction(async (tx) => {
      const application = await tx.application.findFirst({
        where: { paymongoCheckoutId: checkoutId },
      });
      if (!application) return;

      await tx.application.update({
        where: { id: application.id },
        data: { applicationFeePaid: true },
      });
      await tx.payment.upsert({
        where: { applicationId: application.id },
        create: {
          applicationId: application.id,
          amount: Number(process.env.APPLICATION_FEE_PHP ?? 500),
          status: "PAID",
          method: evt?.data?.attributes?.reference_number ? "checkout" : "unknown",
          paidAt: new Date(),
          paymongoId: checkoutId,
        },
        update: { status: "PAID", paidAt: new Date() },
      });
      await tx.notification.create({
        data: {
          userId: application.userId,
          title: "Payment confirmed",
          message: "Your application fee payment has been verified. You can now submit your application.",
        },
      });
    });

    return NextResponse.json({ received: true });
  }

  // Acknowledge other events (payment_intent.created, etc.) without processing.
  return NextResponse.json({ received: true });
}
