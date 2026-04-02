"use client";

import { Input } from "@/components/ui/Input";
import type { Player } from "@/types";

export interface PlayerFormData {
  first_name:   string;
  last_name:    string;
  dob:          string;
  jersey_number: string;
  parent_name:  string;
  parent_email: string;
  parent_phone: string;
}

export const EMPTY_PLAYER_FORM: PlayerFormData = {
  first_name:    "",
  last_name:     "",
  dob:           "",
  jersey_number: "",
  parent_name:   "",
  parent_email:  "",
  parent_phone:  "",
};

export function playerToForm(p: Player): PlayerFormData {
  return {
    first_name:    p.first_name,
    last_name:     p.last_name,
    dob:           p.dob,
    jersey_number: p.jersey_number,
    parent_name:   p.parent_name  ?? "",
    parent_email:  p.parent_email ?? "",
    parent_phone:  p.parent_phone ?? "",
  };
}

interface PlayerFormProps {
  data: PlayerFormData;
  onChange: (data: PlayerFormData) => void;
  errors?: Partial<Record<keyof PlayerFormData, string>>;
}

export function PlayerForm({ data, onChange, errors }: PlayerFormProps) {
  function set(field: keyof PlayerFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...data, [field]: e.target.value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="first_name"
          label="First Name"
          value={data.first_name}
          onChange={set("first_name")}
          error={errors?.first_name}
          required
        />
        <Input
          id="last_name"
          label="Last Name"
          value={data.last_name}
          onChange={set("last_name")}
          error={errors?.last_name}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="dob"
          label="Date of Birth"
          type="date"
          value={data.dob}
          onChange={set("dob")}
          error={errors?.dob}
          required
        />
        <Input
          id="jersey_number"
          label="Jersey #"
          value={data.jersey_number}
          onChange={set("jersey_number")}
          error={errors?.jersey_number}
          required
        />
      </div>

      <hr className="border-border" />
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Parent / Guardian
      </p>

      <Input
        id="parent_name"
        label="Parent Name"
        value={data.parent_name}
        onChange={set("parent_name")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="parent_email"
          label="Email"
          type="email"
          value={data.parent_email}
          onChange={set("parent_email")}
          error={errors?.parent_email}
        />
        <Input
          id="parent_phone"
          label="Phone"
          type="tel"
          placeholder="555-000-0000"
          value={data.parent_phone}
          onChange={set("parent_phone")}
        />
      </div>
    </div>
  );
}
