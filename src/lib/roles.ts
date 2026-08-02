export const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "REGISTRAR",
  "ADMISSIONS_OFFICER",
  "ICTU_SUPERVISOR",
  "ICTU_STAFF",
] as const;

export const ICTU_ROLES = ["ICTU_SUPERVISOR", "ICTU_STAFF"] as const;

export const ACCOUNT_MANAGER_ROLES = ["ICTU_SUPERVISOR", "ICTU_STAFF"] as const;

export function isIctuRole(role?: string) {
  return role === "ICTU_SUPERVISOR" || role === "ICTU_STAFF";
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
