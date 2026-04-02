import type { Metadata } from "next";

export const metadata: Metadata = { title: "Message Board" };

export default function BoardPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2>Message Board</h2>
        <button className="tap-target rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          New Thread
        </button>
      </div>
      {/* Category list / Thread list */}
    </div>
  );
}
