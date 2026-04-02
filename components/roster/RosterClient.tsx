"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { FormModal } from "@/components/forms/FormModal";
import { Button } from "@/components/ui/Button";
import { PlayerForm, EMPTY_PLAYER_FORM, playerToForm } from "./PlayerForm";
import { CsvUpload } from "./CsvUpload";
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

  async function handleDelete(player: Player) {
    if (!confirm(`Remove ${player.first_name} ${player.last_name} from the roster?`)) return;

    const res = await fetch(`/api/players/${player.id}`, { method: "DELETE" });
    if (res.ok) {
      setPlayers((prev) => prev.filter((p) => p.id !== player.id));
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
    alert(`${added} of ${rows.length} players imported successfully.`);
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
                  onClick={() => handleDelete(player)}
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
    </div>
  );
}
