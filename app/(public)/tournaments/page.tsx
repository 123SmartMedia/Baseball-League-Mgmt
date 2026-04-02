import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tournaments" };

export default function TournamentsPage() {
  return (
    <div className="container-app py-12">
      <h1 className="mb-6">Tournaments</h1>
    </div>
  );
}
