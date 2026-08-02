import { createHmac } from "node:crypto";

export const PAYMONGO_API = "https://api.paymongo.com/v1";

function paymongoHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY ?? "").toString("base64")}`,
  };
}

export function isPayMongoConfigured() {
  return Boolean(process.env.PAYMONGO_SECRET_KEY);
}

export function getApplicationFee() {
  const fee = Number(process.env.APPLICATION_FEE_PHP);
  return Number.isFinite(fee) && fee > 0 ? fee : 500;
}

/**
 * Creates a PayMongo Checkout Session for the application fee.
 *
 * When PayMongo is not configured (local development), it returns a
 * "simulated" checkout URL that can be used to complete the payment
 * locally so the admission flow stays testable end-to-end.
 */
export async function createCheckoutSession(input: {
  applicationId: string;
  email: string;
  name: string;
  referenceNumber: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ checkoutUrl: string; checkoutId: string; simulated: boolean }> {
  if (!isPayMongoConfigured()) {
    const checkoutId = `sim_${input.applicationId}`;
    return {
      checkoutId,
      simulated: true,
      checkoutUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/paymongo/simulate?checkout_id=${checkoutId}`,
    };
  }

  const res = await fetch(`${PAYMONGO_API}/checkout_sessions`, {
    method: "POST",
    headers: paymongoHeaders(),
    body: JSON.stringify({
      data: {
        attributes: {
          billing: { name: input.name, email: input.email },
          line_items: [
            {
              currency: "PHP",
              amount: input.amount * 100,
              name: `UA Admission Application Fee (${input.referenceNumber})`,
              quantity: 1,
            },
          ],
          payment_method_types: ["gcash", "card", "paymaya"],
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          description: `University of Antique application fee - ${input.referenceNumber}`,
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayMongo checkout failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as {
    data: { id: string; attributes: { checkout_url: string } };
  };

  return {
    checkoutId: json.data.id,
    simulated: false,
    checkoutUrl: json.data.attributes.checkout_url,
  };
}

/**
 * Verifies a PayMongo webhook signature (HMAC-SHA256 of the raw body).
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const given = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
