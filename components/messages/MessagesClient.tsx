"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import type { Team } from "@/types";

type Channel = "email" | "sms" | "both";
type RecipientType = "all" | "coaches" | "admins" | "team";

interface MessagesClientProps {
  teams: Team[];
}

export function MessagesClient({ teams }: MessagesClientProps) {
  const [channel, setChannel] = useState<Channel>("email");
  const [recipientType, setRecipientType] = useState<RecipientType>("all");
  const [teamId, setTeamId] = useState<string>(teams[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const showSubject = channel === "email" || channel === "both";
  const showTeamSelect = recipientType === "team";

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) { toast.error("Message body is required."); return; }
    if (showSubject && !subject.trim()) { toast.error("Subject is required for emails."); return; }
    if (showTeamSelect && !teamId) { toast.error("Please select a team."); return; }

    setSending(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          subject,
          message,
          recipient_type: recipientType,
          team_id: recipientType === "team" ? teamId : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to send message.");
        return;
      }

      const count = data.sent ?? 0;
      toast.success(`Message sent to ${count} recipient${count !== 1 ? "s" : ""}.`);
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSend} className="max-w-2xl space-y-5">
      {/* Channel */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Channel</label>
        <div className="flex gap-3">
          {(["email", "sms", "both"] as Channel[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors capitalize ${
                channel === c
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {c === "both" ? "Email + SMS" : c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Recipients</label>
        <div className="flex flex-wrap gap-3">
          {([
            { value: "all",     label: "Everyone" },
            { value: "coaches", label: "Coaches only" },
            { value: "admins",  label: "Admins only" },
            { value: "team",    label: "Team parents" },
          ] as { value: RecipientType; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRecipientType(opt.value)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                recipientType === opt.value
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {showTeamSelect && (
          <select
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Subject (email only) */}
      {showSubject && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Game time change — Saturday 9U"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          />
        </div>
      )}

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Message</label>
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here…"
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] resize-none"
        />
        <p className="text-xs text-muted-foreground">{message.length} characters</p>
      </div>

      {/* Send */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="rounded-xl bg-[hsl(var(--primary))] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send Message"}
        </button>
        {sending && (
          <span className="text-sm text-muted-foreground">This may take a moment…</span>
        )}
      </div>
    </form>
  );
}
