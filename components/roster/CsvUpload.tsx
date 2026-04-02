"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { PlayerFormData } from "./PlayerForm";

interface CsvUploadProps {
  onParsed: (players: PlayerFormData[]) => void;
}

const REQUIRED_HEADERS = ["first_name", "last_name", "dob", "jersey_number"];

export function CsvUpload({ onParsed }: CsvUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCsv(text);
        onParsed(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV");
      } finally {
        // Reset so the same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        Upload CSV
      </Button>

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        Required columns: first_name, last_name, dob (YYYY-MM-DD), jersey_number
      </p>
    </div>
  );
}

function parseCsv(text: string): PlayerFormData[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one player.");

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  for (const req of REQUIRED_HEADERS) {
    if (!headers.includes(req)) {
      throw new Error(`CSV missing required column: "${req}"`);
    }
  }

  return lines.slice(1).map((line, i) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ""; });

    if (!row.first_name || !row.last_name || !row.dob || !row.jersey_number) {
      throw new Error(`Row ${i + 2}: missing required fields.`);
    }

    return {
      first_name:    row.first_name,
      last_name:     row.last_name,
      dob:           row.dob,
      jersey_number: row.jersey_number,
      parent_name:   row.parent_name  ?? "",
      parent_email:  row.parent_email ?? "",
      parent_phone:  row.parent_phone ?? "",
    };
  });
}
