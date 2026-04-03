import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { RulesClient } from "@/components/rules/RulesClient";
import type { Rule } from "@/types";

export const metadata: Metadata = { title: "Rules" };

export default async function RulesPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("rules")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .order("order_index", { ascending: true });

  const rules = (data ?? []) as Rule[];
  const isAdmin = profile.role === "admin";

  return (
    <div>
      <div className="mb-6">
        <h2>Rules</h2>
        <p className="text-sm text-muted-foreground">
          {rules.length} rule{rules.length !== 1 ? "s" : ""}
          {isAdmin ? " · Add, edit, or remove rules for your organization." : ""}
        </p>
      </div>

      <RulesClient initialRules={rules} isAdmin={isAdmin} />
    </div>
  );
}
