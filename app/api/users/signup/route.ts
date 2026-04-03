import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, full_name, organization_id } = body;

  if (!email?.trim() || !password || !full_name?.trim() || !organization_id) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  // Verify org exists before creating user
  const { data: org, error: orgError } = await (adminClient.from("organizations") as any)
    .select("id")
    .eq("id", organization_id)
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: "Invalid organization" }, { status: 400 });
  }

  // Create auth user — trigger fires and inserts profile via handle_new_user
  const { data, error } = await adminClient.auth.admin.createUser({
    email: email.trim(),
    password,
    email_confirm: true,
    user_metadata: {
      full_name: full_name.trim(),
      organization_id,
      role: "coach",
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Belt-and-suspenders: upsert profile in case trigger didn't fire
  await (adminClient.from("profiles") as any).upsert({
    id: data.user.id,
    organization_id,
    full_name: full_name.trim(),
    email: email.trim(),
    role: "coach",
  }, { onConflict: "id" });

  return NextResponse.json({ success: true, userId: data.user.id }, { status: 201 });
}
