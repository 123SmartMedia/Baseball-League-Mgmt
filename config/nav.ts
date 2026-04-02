export interface NavItem {
  label: string;
  href: string;
  adminOnly?: boolean;
}

export const PORTAL_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Teams", href: "/teams" },
  { label: "Schedule", href: "/schedule" },
  { label: "Standings", href: "/standings" },
  { label: "Rules", href: "/rules" },
  { label: "Message Board", href: "/board" },
  { label: "Messaging", href: "/messages", adminOnly: true },
];

export const PUBLIC_NAV: NavItem[] = [
  { label: "Leagues", href: "/leagues" },
  { label: "Tournaments", href: "/tournaments" },
];
