import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/dashboard";
import { UsersClient } from "@/components/users/UsersClient";
import type { Profile } from "@/types";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .order("full_name", { ascending: true });

  const profiles = (data ?? []) as Profile[];

  return (
    <div>
      <div className="mb-6">
        <h2>Users</h2>
        <p className="text-sm text-muted-foreground">
          Manage coaches and admins in your organization.
        </p>
      </div>
      <UsersClient profiles={profiles} />
    </div>
  );
}
