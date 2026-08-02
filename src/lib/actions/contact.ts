"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function submitContactMessage(input: unknown) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your inputs." };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  return { ok: true };
}
