/**
 * Generated Supabase types.
 *
 * To regenerate after schema changes:
 *   npx supabase gen types typescript --project-id <your-project-id> > types/supabase.ts
 *
 * The shape below is hand-authored to match 0001_initial_schema.sql
 * until the Supabase project is wired up.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type UserRole = "admin" | "coach";
export type GameStatus = "scheduled" | "live" | "final" | "cancelled";
export type EventType = "league" | "tournament";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          primary_color: string | null;
          accent_color: string | null;
          domain: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organizations"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      leagues: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          age_group: string;
          season: string;
          description: string | null;
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leagues"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["leagues"]["Insert"]>;
      };
      tournaments: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          age_group: string;
          description: string | null;
          start_date: string;
          end_date: string;
          location: string | null;
          entry_fee_cents: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tournaments"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["tournaments"]["Insert"]>;
      };
      teams: {
        Row: {
          id: string;
          organization_id: string;
          league_id: string | null;
          tournament_id: string | null;
          name: string;
          coach_id: string | null;
          wins: number;
          losses: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teams"]["Row"], "id" | "created_at" | "wins" | "losses"> & { id?: string; wins?: number; losses?: number };
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
      };
      players: {
        Row: {
          id: string;
          organization_id: string;
          team_id: string;
          first_name: string;
          last_name: string;
          dob: string;
          jersey_number: string;
          parent_name: string | null;
          parent_email: string | null;
          parent_phone: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["players"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["players"]["Insert"]>;
      };
      games: {
        Row: {
          id: string;
          organization_id: string;
          league_id: string | null;
          tournament_id: string | null;
          home_team_id: string;
          away_team_id: string;
          scheduled_at: string;
          field: string | null;
          status: GameStatus;
          home_score: number | null;
          away_score: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["games"]["Row"], "id" | "created_at" | "status"> & { id?: string; status?: GameStatus };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
      };
      rules: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          body: string;
          age_group: string | null;
          event_type: EventType | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rules"]["Row"], "id" | "created_at" | "order_index"> & { id?: string; order_index?: number };
        Update: Partial<Database["public"]["Tables"]["rules"]["Insert"]>;
      };
      board_categories: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          order_index: number;
        };
        Insert: Omit<Database["public"]["Tables"]["board_categories"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["board_categories"]["Insert"]>;
      };
      board_threads: {
        Row: {
          id: string;
          organization_id: string;
          category_id: string;
          author_id: string;
          title: string;
          body: string;
          pinned: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["board_threads"]["Row"], "id" | "created_at" | "pinned"> & { id?: string; pinned?: boolean };
        Update: Partial<Database["public"]["Tables"]["board_threads"]["Insert"]>;
      };
      board_comments: {
        Row: {
          id: string;
          thread_id: string;
          author_id: string;
          body: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["board_comments"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["board_comments"]["Insert"]>;
      };
    };
    Views: {
      standings: {
        Row: {
          team_id: string;
          team_name: string;
          organization_id: string;
          league_id: string | null;
          tournament_id: string | null;
          wins: number;
          losses: number;
          runs_for: number;
          runs_against: number;
          win_pct: number;
        };
      };
    };
    Functions: {
      auth_org_id: { Returns: string };
      auth_role: { Returns: UserRole };
    };
    Enums: {
      user_role: UserRole;
      game_status: GameStatus;
      event_type: EventType;
    };
  };
}
