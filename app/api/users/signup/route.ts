import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { email, password, full_name, organization_id } = await req.json();

  if (!email || !password || !full_name || !organization_id) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  // Verify org exists
  const { data: org } = await (adminClient.from("organizations") as any)
    .select("id")
    .eq("id", organization_id)
    .single();

  if (!org) {
    return NextResponse.json({ error: "Invalid organization" }, { status: 400 });
  }

  // Create user — role is always 'coach' for self-signup
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip email confirmation for now
    user_metadata: {
      full_name,
      organization_id,
      role: "coach",
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Profile is created by the handle_new_user trigger automatically
  return NextResponse.json({ success: true, userId: data.user.id }, { status: 201 });
}
