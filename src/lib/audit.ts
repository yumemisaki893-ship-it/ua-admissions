import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type AuditInput = {
  action: string;
  entity?: string;
  entityId?: string;
  details?: unknown;
};

export async function recordAudit(input: AuditInput) {
  try {
    const session = await auth();
    const h = headers();
    const forwarded = h.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;
    const userAgent = h.get("user-agent") ?? null;

    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id ?? "system",
        userName: session?.user?.name ?? null,
        userRole: session?.user?.role ?? "SYSTEM",
        action: input.action,
        entity: input.entity ?? null,
        entityId: input.entityId ?? null,
        details: (input.details ?? null) as Prisma.InputJsonValue,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("recordAudit failed:", error);
  }
}
