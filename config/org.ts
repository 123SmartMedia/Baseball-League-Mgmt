/**
 * Organization branding config.
 * Each tenant can override these values pulled from the DB.
 * CSS variables are applied at runtime via ThemeProvider.
 */
export interface OrgBranding {
  name: string;
  logo_url: string;
  /** HSL values e.g. "220 90% 50%" */
  primary: string;
  primary_foreground: string;
  accent: string;
}

export const DEFAULT_BRANDING: OrgBranding = {
  name: "League Platform",
  logo_url: "/logo.svg",
  primary: "220 90% 50%",
  primary_foreground: "0 0% 100%",
  accent: "12 90% 55%",
};

/**
 * Converts an OrgBranding object into CSS variable overrides
 * that can be applied inline on the root element.
 */
export function brandingToCssVars(
  branding: Partial<OrgBranding>
): Record<string, string> {
  const vars: Record<string, string> = {};
  if (branding.primary) vars["--primary"] = branding.primary;
  if (branding.primary_foreground)
    vars["--primary-foreground"] = branding.primary_foreground;
  if (branding.accent) vars["--accent"] = branding.accent;
  return vars;
}
