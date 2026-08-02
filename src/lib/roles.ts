export const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "REGISTRAR",
  "ADMISSIONS_OFFICER",
  "ICTU_SUPERVISOR",
  "ICTU_STAFF",
] as const;

export const ICTU_ROLES = ["ICTU_SUPERVISOR", "ICTU_STAFF"] as const;

export const ACCOUNT_MANAGER_ROLES = ["ICTU_SUPERVISOR", "ICTU_STAFF"] as const;

export const CONTENT_ROLES = ["SUPER_ADMIN", "ICTU_SUPERVISOR", "ICTU_STAFF"] as const;

export const OVERSIGHT_RANK: Record<string, number> = {
  SUPER_ADMIN: 6,
  ICTU_SUPERVISOR: 5,
  ICTU_STAFF: 4,
  REGISTRAR: 3,
  ADMISSIONS_OFFICER: 2,
  TEACHER: 1,
  STUDENT: 0,
};

export function isIctuRole(role?: string) {
  return role === "ICTU_SUPERVISOR" || role === "ICTU_STAFF";
}

export function isContentManager(role?: string) {
  return Boolean(role && (CONTENT_ROLES as readonly string[]).includes(role));
}

export function hasOversight(role?: string) {
  const rank = role ? OVERSIGHT_RANK[role] : undefined;
  return rank !== undefined && rank >= 2;
}

export function canOversee(actorRole: string | undefined, targetRole: string | null | undefined) {
  const actorRank = actorRole ? (OVERSIGHT_RANK[actorRole] ?? 0) : 0;
  const targetRank = targetRole ? (OVERSIGHT_RANK[targetRole] ?? 0) : 0;
  return actorRank >= targetRank;
}

export function oversightScope(actorRole: string | undefined): string[] | null {
  const rank = actorRole ? (OVERSIGHT_RANK[actorRole] ?? 0) : 0;
  return Object.entries(OVERSIGHT_RANK)
    .filter(([, r]) => r <= rank)
    .map(([role]) => role);
}

export function isAdminRole(role?: string) {
  return Boolean(role && (ADMIN_ROLES as readonly string[]).includes(role));
}

export function isSupervisor(role?: string) {
  return role === "ICTU_SUPERVISOR";
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Developer",
  REGISTRAR: "Registrar",
  ADMISSIONS_OFFICER: "Admissions Officer",
  ICTU_SUPERVISOR: "ICTU Supervisor",
  ICTU_STAFF: "ICTU Staff",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

export function roleLabel(role: string) {
  return ROLE_LABELS[role] ?? role.replaceAll("_", " ").toLowerCase();
}
