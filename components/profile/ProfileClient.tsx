"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import type { Profile } from "@/types";

interface ProfileClientProps {
  profile: Profile;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  coach: "Coach",
};

export function ProfileClient({ profile }: ProfileClientProps) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [saving, setSaving] = useState(false);

  const inputCls = "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) { toast.error("Name is required."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, phone }),
      });
      if (res.ok) {
        toast.success("Profile saved.");
      } else {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save profile.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Account info (read-only) */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Account</p>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Email</span>
            <span className="text-sm">{profile.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Role</span>
            <span className="inline-flex">
              <span className="rounded-full bg-[hsl(var(--primary)/0.1)] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--primary))]">
                {ROLE_LABELS[profile.role] ?? profile.role}
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Member since</span>
            <span className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Profile</p>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Full Name</label>
          <input
            className={inputCls}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Phone <span className="font-normal text-muted-foreground">(optional)</span></label>
          <input
            type="tel"
            className={inputCls}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[hsl(var(--primary))] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
