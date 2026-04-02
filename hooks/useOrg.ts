"use client";

import { useEffect, useState } from "react";
import type { Organization } from "@/types";
import { DEFAULT_BRANDING, brandingToCssVars } from "@/config/org";
import { useSupabase } from "./useSupabase";

export function useOrg(organizationId: string | null) {
  const supabase = useSupabase();
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (!organizationId) return;

    supabase
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const row = data as Organization;
        setOrg(row);
        const vars = brandingToCssVars({
          primary: row.primary_color ?? DEFAULT_BRANDING.primary,
          accent: row.accent_color ?? DEFAULT_BRANDING.accent,
        });
        Object.entries(vars).forEach(([k, v]) =>
          document.documentElement.style.setProperty(k, v)
        );
      });
  }, [organizationId, supabase]);

  return org;
}
