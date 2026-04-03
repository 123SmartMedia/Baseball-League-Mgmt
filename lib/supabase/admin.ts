import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Service-role client — bypasses RLS.
 * Only use in server-side API routes, never expose to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase service role credentials");
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
