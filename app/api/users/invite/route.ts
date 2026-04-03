import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (!callerProfile || (callerProfile as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, full_name, role } = await req.json();

  if (!email || !full_name || !role) {
    return NextResponse.json({ error: "email, full_name, and role are required" }, { status: 400 });
  }
  if (!["admin", "coach"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const organizationId = (callerProfile as any).organization_id;
  const adminClient = createAdminClient();

  // Invite sends a magic link — user clicks it to set their password
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { full_name, role, organization_id: organizationId },
    redirectTo: `${req.headers.get("origin") ?? ""}/api/auth/callback?next=/dashboard`,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Upsert profile immediately so the user appears in the portal right away
  const { error: profileError } = await (adminClient.from("profiles") as any).upsert({
    id: data.user.id,
    organization_id: organizationId,
    full_name,
    email,
    role,
  }, { onConflict: "id" });

  if (profileError) {
    // Non-fatal — trigger will handle it when they accept the invite
    console.error("Profile upsert error:", profileError.message);
  }

  return NextResponse.json({ success: true, email });
}
