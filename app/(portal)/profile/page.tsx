import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata: Metadata = { title: "Settings" };

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div>
      <div className="mb-6">
        <h2>Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account details.</p>
      </div>
      <ProfileClient profile={profile} />
    </div>
  );
}
