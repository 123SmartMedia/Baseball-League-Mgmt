import type { Metadata } from "next";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2>Schedule</h2>
        <button className="tap-target rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Add Game
        </button>
      </div>
      {/* ScheduleList component */}
    </div>
  );
}
