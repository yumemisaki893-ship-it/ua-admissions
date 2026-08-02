import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Link2,
  Fingerprint,
  type LucideIcon,
} from "lucide-react";

export type AdminNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminLinks: AdminNavLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applicants", label: "Applicants", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/links", label: "Links", icon: Link2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export const ictuLinks: AdminNavLink[] = [
  { href: "/admin", label: "Oversight", icon: LayoutDashboard },
  { href: "/admin/ictu/registrars", label: "Registrars", icon: Users },
  { href: "/admin/ictu/audit", label: "Audit Trail", icon: Fingerprint },
];
