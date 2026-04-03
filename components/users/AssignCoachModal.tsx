"use client";

import { useState } from "react";
import { FormModal } from "@/components/forms/FormModal";
import type { Profile, Team } from "@/types";

interface AssignCoachModalProps {
  team: Team;
  coaches: Profile[];
  open: boolean;
  onClose: () => void;
  onAssigned: (teamId: string, coach: Profile | null) => void;
}

export function AssignCoachModal({
  team,
  coaches,
  open,
  onClose,
  onAssigned,
}: AssignCoachModalProps) {
  const [selectedId, setSelectedId] = useState<string>(team.coach_id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coach_id: selectedId || null }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to assign coach.");
        return;
      }

      const assigned = coaches.find((c) => c.id === selectedId) ?? null;
      onAssigned(team.id, assigned);
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormModal
      title={`Assign Coach — ${team.name}`}
      open={open}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel="Save"
      loading={loading}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="coach" className="text-sm font-medium">
          Coach
        </label>
        <select
          id="coach"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="">— Unassigned —</option>
          {coaches.map((coach) => (
            <option key={coach.id} value={coach.id}>
              {coach.full_name} ({coach.email})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </FormModal>
  );
}
