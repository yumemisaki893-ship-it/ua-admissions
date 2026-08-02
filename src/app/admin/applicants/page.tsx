import Link from "next/link";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicantFilters } from "@/components/admin/applicant-filters";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED"];

const badgeVariant = (status: string) =>
  status === "ACCEPTED"
    ? "success"
    : status === "REJECTED"
      ? "destructive"
      : status === "UNDER_REVIEW"
        ? "warning"
        : "default";

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const status = (searchParams.status ?? "ALL").toUpperCase();

  const where: Prisma.ApplicationWhereInput = {
    status: { not: "DRAFT" },
    ...(q
      ? {
          OR: [
            { referenceNumber: { contains: q, mode: "insensitive" as const } },
            { studentProfile: { firstName: { contains: q, mode: "insensitive" as const } } },
            { studentProfile: { lastName: { contains: q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(status !== "ALL" && (STATUSES as string[]).includes(status)
      ? { status: status as "PENDING" }
      : {}),
  };

  const applicants = await prisma.application.findMany({
    where,
    orderBy: { submittedAt: "desc" },
    include: {
      studentProfile: true,
      course: { select: { code: true, name: true } },
      documents: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Applicants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {applicants.length} submitted application{applicants.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <ApplicantFilters q={q} status={status} />

      <Card>
        <CardContent className="p-0">
          {applicants.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No applicants found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Docs</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <Link href={`/admin/applicants/${app.id}`} className="font-mono text-xs font-semibold text-sky-700 hover:underline">
                        {app.referenceNumber ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-navy-900">
                        {app.studentProfile.lastName}, {app.studentProfile.firstName}
                      </p>
                      <p className="text-xs text-muted-foreground">{app.studentProfile.contactNumber}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{app.course.code}</p>
                      <p className="text-xs text-muted-foreground">{app.course.name}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={app.documents.length >= 3 ? "success" : "destructive"}>
                        {app.documents.length}/3
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.applicationFeePaid ? (
                        <Badge variant="success">Paid</Badge>
                      ) : (
                        <Badge variant="outline">Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(app.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant(app.status)}>{app.status.replace("_", " ")}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
