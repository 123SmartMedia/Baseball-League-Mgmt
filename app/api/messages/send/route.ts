import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/messaging/email";
import { sendSms } from "@/lib/messaging/sms";

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { channel, subject, message, recipient_type, team_id } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }
  if (channel === "email" && !subject?.trim()) {
    return NextResponse.json({ error: "Subject is required for emails." }, { status: 400 });
  }

  // Resolve recipients
  let profilesQuery = (supabase.from("profiles") as any)
    .select("email, phone, full_name")
    .eq("organization_id", (profile as any).organization_id);

  if (recipient_type === "coaches") {
    profilesQuery = profilesQuery.eq("role", "coach");
  } else if (recipient_type === "admins") {
    profilesQuery = profilesQuery.eq("role", "admin");
  } else if (recipient_type === "team" && team_id) {
    // Get players' parent emails for a specific team
    const { data: players } = await (supabase.from("players") as any)
      .select("parent_email, parent_phone")
      .eq("team_id", team_id)
      .not("parent_email", "is", null);

    const teamPlayers = (players ?? []) as Array<{ parent_email: string | null; parent_phone: string | null }>;

    let sent = 0;
    const errors: string[] = [];

    for (const player of teamPlayers) {
      try {
        if ((channel === "email" || channel === "both") && player.parent_email) {
          await sendEmail({ to: player.parent_email, subject, html: `<p>${message.replace(/\n/g, "<br>")}</p>` });
          sent++;
        }
        if ((channel === "sms" || channel === "both") && player.parent_phone) {
          await sendSms({ to: player.parent_phone, body: message });
          sent++;
        }
      } catch (err) {
        errors.push(err instanceof Error ? err.message : "Unknown error");
      }
    }

    return NextResponse.json({ sent, errors: errors.length > 0 ? errors : undefined });
  }

  const { data: recipients } = await profilesQuery;
  const profiles = (recipients ?? []) as Array<{ email: string; phone: string | null; full_name: string }>;

  let sent = 0;
  const errors: string[] = [];

  for (const p of profiles) {
    try {
      if ((channel === "email" || channel === "both") && p.email) {
        await sendEmail({ to: p.email, subject, html: `<p>${message.replace(/\n/g, "<br>")}</p>` });
        sent++;
      }
      if ((channel === "sms" || channel === "both") && p.phone) {
        await sendSms({ to: p.phone, body: message });
        sent++;
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return NextResponse.json({ sent, errors: errors.length > 0 ? errors : undefined });
}
