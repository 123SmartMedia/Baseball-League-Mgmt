/**
 * Email sending via SendGrid.
 * Uses the REST API directly to avoid a heavy SDK dependency.
 */

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.SENDGRID_FROM_EMAIL!,
}: SendEmailParams) {
  const recipients = Array.isArray(to)
    ? to.map((email) => ({ email }))
    : [{ email: to }];

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: recipients }],
      from: { email: from },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SendGrid error: ${err}`);
  }
}
