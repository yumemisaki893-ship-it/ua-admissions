export const ACTION_LABELS: Record<string, string> = {
  AUTH_LOGIN: "Sign in",
  ACCOUNT_CREATE: "Account created",
  ACCOUNT_DELETE: "Account deleted",
  ADMIN_ACCOUNT_CREATE: "Account created",
  ADMIN_ACCOUNT_TOGGLE_ACTIVE: "Account status changed",
  NEWS_CREATE: "News published",
  NEWS_UPDATE: "News updated",
  NEWS_DELETE: "News deleted",
  SITE_CONTENT_UPDATE: "Site content updated",
  COLLEGE_CREATE: "College created",
  COLLEGE_UPDATE: "College updated",
  COLLEGE_DELETE: "College deleted",
  COURSE_CREATE: "Course created",
  COURSE_UPDATE: "Course updated",
  COURSE_DELETE: "Course deleted",
  SETTINGS_UPDATE: "Settings updated",
  ANNOUNCEMENT_SEND: "Announcement sent",
  APPLICATION_STATUS_UPDATE: "Application status changed",
  SUBJECT_CREATE: "Subject created",
  SUBJECT_UPDATE: "Subject updated",
  SUBJECT_DELETE: "Subject deleted",
  CLASS_CREATE: "Class created",
  CLASS_UPDATE: "Class updated",
  CLASS_DELETE: "Class deleted",
  GRADE_SUBMIT: "Grade change",
  CLASS_ENROLL_STUDENT: "Student enrolled to class",
  CLASS_UNENROLL_STUDENT: "Student removed from class",
};

export function actionLabel(action: string) {
  return ACTION_LABELS[action] ?? action.replaceAll("_", " ").toLowerCase();
}

type AuditLogRow = {
  action: string;
  entity: string | null;
  entityId: string | null;
  details: unknown;
};

function d(log: AuditLogRow): Record<string, unknown> {
  if (!log.details || typeof log.details !== "object") return {};
  return log.details as Record<string, unknown>;
}

export function describeAudit(log: AuditLogRow): string {
  const details = d(log);
  const student = details.studentName
    ? `${String(details.studentName)}${details.studentNumber ? ` (${String(details.studentNumber)})` : ""}`
    : null;
  const classRef = [details.subjectCode, details.section].filter(Boolean).join(" · ");

  switch (log.action) {
    case "GRADE_SUBMIT":
      return student
        ? `Grade change for ${student} in ${classRef || "class"}: ${details.oldGrade ?? "—"} → ${String(details.newGrade ?? "—")}${details.semester ? ` (${details.semester} ${details.academicYear ?? ""})` : ""}`
        : "Grade submitted";
    case "CLASS_ENROLL_STUDENT":
      return student ? `Enrolled ${student} to ${classRef || "class"}` : "Student enrolled";
    case "CLASS_UNENROLL_STUDENT":
      return student ? `Removed ${student} from ${classRef || "class"}` : "Student removed";
    case "ACCOUNT_CREATE":
      return details.role ? `Created ${String(details.role).replace("_", " ").toLowerCase()} account` : "Account created";
    case "ACCOUNT_DELETE":
      return details.role ? `Deleted ${String(details.role).replace("_", " ").toLowerCase()} account` : "Account deleted";
    default: {
      const extras = Object.entries(details)
        .filter(([k, v]) => v !== undefined && v !== null && !["studentName", "studentNumber", "subjectCode", "subjectTitle", "section", "semester", "academicYear", "by"].includes(k))
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(", ");
      return extras ? extras : log.entity ?? "system";
    }
  }
}
