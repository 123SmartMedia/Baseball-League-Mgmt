"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { FormModal } from "@/components/forms/FormModal";
import { Button } from "@/components/ui/Button";
import { PlayerForm, EMPTY_PLAYER_FORM, playerToForm } from "./PlayerForm";
import { CsvUpload } from "./CsvUpload";
import { toast } from "@/lib/toast";
import type { PlayerFormData } from "./PlayerForm";
import type { Player } from "@/types";

interface RosterClientProps {
  players: Player[];
  teamId: string;
  organizationId: string;
  isAdmin: boolean;
}

export function RosterClient({
  players: initialPlayers,
  teamId,
  organizationId,
  isAdmin,
}: RosterClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [formData, setFormData] = useState<PlayerFormData>(EMPTY_PLAYER_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openAdd() {
    setEditing(null);
    setFormData(EMPTY_PLAYER_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(player: Player) {
    setEditing(player);
    setFormData(playerToForm(player));
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSave() {
    setFormError(null);

    if (!formData.first_name || !formData.last_name || !formData.dob || !formData.jersey_number) {
      setFormError("First name, last name, date of birth, and jersey number are required.");
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        const res = await fetch(`/api/players/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const { error } = await res.json();
          setFormError(error ?? "Failed to update player.");
          return;
        }
        const updated: Player = await res.json();
        setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch("/api/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, team_id: teamId, organization_id: organizationId }),
        });
        if (!res.ok) {
          const { error } = await res.json();
          setFormError(error ?? "Failed to add player.");
          return;
        }
        const created: Player = await res.json();
        setPlayers((prev) =>
          [...prev, created].sort((a, b) => a.jersey_number.localeCompare(b.jersey_number, undefined, { numeric: true }))
        );
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/players/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setPlayers((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success(`${deleteTarget.first_name} ${deleteTarget.last_name} removed.`);
      } else {
        toast.error("Failed to remove player.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleCsvParsed(rows: PlayerFormData[]) {
    setSaving(true);
    let added = 0;

    for (const row of rows) {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...row, team_id: teamId, organization_id: organizationId }),
      });
      if (res.ok) {
        const player: Player = await res.json();
        setPlayers((prev) => [...prev, player]);
        added++;
      }
    }

    setSaving(false);
    startTransition(() => router.refresh());
    toast.success(`${added} of ${rows.length} players imported successfully.`);
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button onClick={openAdd}>Add Player</Button>
        <CsvUpload onParsed={handleCsvParsed} />
        {saving && (
          <span className="text-sm text-muted-foreground">Saving…</span>
        )}
      </div>

      {/* Player count */}
      <p className="mb-4 text-sm text-muted-foreground">
        {players.length} player{players.length !== 1 ? "s" : ""} on roster
      </p>

      {/* Roster list */}
      {players.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          No players yet. Add your first player or upload a CSV.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {players.map((player) => (
            <div key={player.id} className="group relative">
              <PlayerCard
                player={player}
                showParentInfo={isAdmin}
                onEdit={openEdit}
              />
              {isAdmin && (
                <button
                  onClick={() => setDeleteTarget(player)}
                  className="absolute right-14 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <FormModal
        title={editing ? "Edit Player" : "Add Player"}
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        submitLabel={editing ? "Save Changes" : "Add Player"}
        loading={saving}
      >
        <PlayerForm data={formData} onChange={setFormData} />
        {formError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        )}
      </FormModal>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="mb-2">Remove Player?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {deleteTarget.first_name} {deleteTarget.last_name}
              </span>{" "}
              will be permanently removed from the roster.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
