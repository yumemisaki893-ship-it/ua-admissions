import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClassRoster } from "@/components/teacher/class-roster";

export const dynamic = "force-dynamic";

export default async function TeacherClassPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const classRow = await prisma.class.findFirst({
    where: { id: params.id, teacherId: session.user.id },
    include: {
      subject: true,
      enrollments: {
        include: { studentProfile: { include: { user: { select: { name: true, email: true } } } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!classRow) redirect("/teacher/classes");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{classRow.academicYear} · {classRow.semester}</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {classRow.subject.code} — {classRow.subject.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Section {classRow.section}
          {classRow.schedule ? ` · ${classRow.schedule}` : ""}
          {classRow.room ? ` · Room ${classRow.room}` : ""}
        </p>
      </div>

      <ClassRoster
        classId={classRow.id}
        enrollments={classRow.enrollments.map((e) => ({
          id: e.id,
          studentNumber: e.studentProfile.studentNumber,
          name: e.studentProfile.user.name ?? e.studentProfile.user.email,
          grade: e.grade,
          remarks: e.remarks,
        }))}
      />
    </div>
  );
}
