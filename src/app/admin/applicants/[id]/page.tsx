import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, FileText, Mail, Phone, MapPin, CalendarDays, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusUpdateForm } from "@/components/admin/status-update-form";
import { prisma } from "@/lib/prisma";
import { formatBytes, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const documentMeta: Record<string, { label: string; hint: string }> = {
  BIRTH_CERT: { label: "PSA Birth Certificate", hint: "Birth certificate" },
  FORM_137: { label: "Form 137", hint: "High school records" },
  PHOTO: { label: "2x2 ID Photo", hint: "Identification photo" },
};

export default async function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      studentProfile: true,
      course: { include: { college: true } },
      documents: true,
      payment: true,
      user: { select: { email: true } },
    },
  });

  if (!application) notFound();

  const name = [application.studentProfile.firstName, application.studentProfile.middleName, application.studentProfile.lastName, application.studentProfile.suffix]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/applicants"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson-300 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All Applicants
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white">{name}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs font-semibold text-crimson-300">
              {application.referenceNumber ?? "No reference yet"}
            </span>
            <Badge variant={application.status === "ACCEPTED" ? "success" : application.status === "REJECTED" ? "destructive" : application.status === "UNDER_REVIEW" ? "warning" : "secondary"}>
              {application.status.replace("_", " ")}
            </Badge>
            {application.applicationFeePaid && <Badge variant="success">Fee Paid</Badge>}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Personal info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Applicant Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Birth date:</span>{" "}
                <span className="font-medium text-white">{formatDate(application.studentProfile.birthDate)}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Gender:</span>{" "}
                <span className="font-medium text-white">{application.studentProfile.gender}</span>
              </p>
              <p className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>{" "}
                <span className="font-medium text-white">
                  {application.studentProfile.address}, {application.studentProfile.city},{" "}
                  {application.studentProfile.province}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Contact:</span>{" "}
                <span className="font-medium text-white">{application.studentProfile.contactNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium text-white">{application.user.email}</span>
              </p>
              <p className="sm:col-span-2">
                <span className="text-muted-foreground">Guardian:</span>{" "}
                <span className="font-medium text-white">
                  {application.studentProfile.guardianName}
                  {application.studentProfile.guardianContact ? ` (${application.studentProfile.guardianContact})` : ""}
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Course */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-display text-base font-semibold text-white">
                {application.course.name}{" "}
                <span className="font-mono text-xs font-normal text-crimson-300">({application.course.code})</span>
              </p>
              <p className="mt-1 text-muted-foreground">{application.course.college.name}</p>
              {application.submittedAt && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Submitted {formatDate(application.submittedAt)}
                  {application.reviewedAt ? ` · Reviewed ${formatDate(application.reviewedAt)}` : ""}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-crimson-300" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {application.payment ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  <p><span className="text-muted-foreground">Amount:</span>{" "}<strong className="text-white">PHP {application.payment.amount.toLocaleString()}</strong></p>
                  <p><span className="text-muted-foreground">Status:</span>{" "}<Badge variant="success">{application.payment.status}</Badge></p>
                  <p><span className="text-muted-foreground">Paid:</span>{" "}{formatDate(application.payment.paidAt)}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No payment record. <Badge variant="outline" className="ml-1">Unpaid</Badge></p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>Click to preview or download.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {application.documents.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No documents uploaded.</p>
              )}
              {application.documents.map((doc) => {
                const meta = documentMeta[doc.type] ?? { label: doc.type, hint: "" };
                return (
                  <div key={doc.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="h-5 w-5 shrink-0 text-crimson-300" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{meta.label}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {doc.fileName} · {formatBytes(doc.sizeBytes)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <Button variant="ghost" size="icon" asChild title="Open">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Download">
                        <a href={doc.url} download={doc.fileName}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <StatusUpdateForm
            applicationId={application.id}
            currentStatus={application.status}
            remarks={application.remarks}
          />
        </div>
      </div>
    </div>
  );
}
