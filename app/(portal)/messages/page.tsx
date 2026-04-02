import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messaging" };

export default function MessagesPage() {
  return (
    <div>
      <h2 className="mb-6">Send Message</h2>
      {/* Compose email/SMS form */}
    </div>
  );
}
