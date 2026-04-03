"use client";

import { useState } from "react";
import { FormModal } from "@/components/forms/FormModal";
import { Input } from "@/components/ui/Input";
import type { UserRole } from "@/types";

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onInvited: (email: string, role: UserRole) => void;
}

export function InviteUserModal({ open, onClose, onInvited }: InviteUserModalProps) {
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [role, setRole]           = useState<UserRole>("coach");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  function resetForm() {
    setFullName(""); setEmail(""); setRole("coach"); setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSave() {
    setError(null);
    if (!fullName || !email) {
      setError("Name and email are required.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/users/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, email, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to send invite.");
      return;
    }

    onInvited(email, role);
    handleClose();
  }

  return (
    <FormModal
      title="Invite User"
      open={open}
      onClose={handleClose}
      onSubmit={handleSave}
      submitLabel="Send Invite"
      loading={loading}
    >
      <Input
        id="full_name"
        label="Full Name"
        placeholder="Jane Smith"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="coach@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="coach">Coach</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <p className="text-xs text-muted-foreground">
        An invite email will be sent. They'll click a link to set their password and access the portal.
      </p>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </FormModal>
  );
}
