"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InviteUserModal } from "./InviteUserModal";
import type { Profile, UserRole } from "@/types";

interface UsersClientProps {
  profiles: Profile[];
}

export function UsersClient({ profiles: initialProfiles }: UsersClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  function handleInvited(email: string, role: UserRole) {
    showToast(`Invite sent to ${email} as ${role}.`);
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {profiles.length} user{profiles.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={() => setModalOpen(true)}>Invite User</Button>
      </div>

      {/* Users list */}
      <div className="flex flex-col gap-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold">{profile.full_name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
              profile.role === "admin"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}>
              {profile.role}
            </span>
          </div>
        ))}

        {profiles.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No users yet. Invite your first coach or admin.
          </div>
        )}
      </div>

      {/* Invite modal */}
      <InviteUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onInvited={handleInvited}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-foreground px-5 py-3 text-sm text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
