import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tournament Detail" };

export default function TournamentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container-app py-12">
      <h1 className="mb-6">Tournament</h1>
      {/* Tabs: Overview | Teams | Schedule | Standings | Rules */}
    </div>
  );
}
