import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalTopbar } from "@/components/layout/PortalTopbar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-secondary">
      <PortalSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PortalTopbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
