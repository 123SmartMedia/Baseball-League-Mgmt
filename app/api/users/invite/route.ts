import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  // Verify caller is an authenticated admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, full_name, role } = await req.json();

  if (!email || !full_name || !role) {
    return NextResponse.json({ error: "email, full_name, and role are required" }, { status: 400 });
  }
  if (!["admin", "coach"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  // Invite user — sends a magic link email, they set their own password
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name,
      role,
      organization_id: (profile as any).organization_id,
    },
    redirectTo: `${req.headers.get("origin")}/api/auth/callback?next=/dashboard`,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Manually insert profile — the trigger only fires on new signups, not invites
  const adminSupabase = createAdminClient();
  await (adminSupabase.from("profiles") as any).upsert({
    id: data.user.id,
    organization_id: (profile as any).organization_id,
    full_name,
    email,
    role,
  });

  return NextResponse.json({ success: true, email });
}
