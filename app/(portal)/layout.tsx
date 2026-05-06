import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalTopbar } from "@/components/layout/PortalTopbar";
import { Toaster } from "@/components/ui/Toaster";
import { getProfile } from "@/lib/data/dashboard";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <div className="flex h-screen overflow-hidden bg-secondary">
      <PortalSidebar role={profile?.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PortalTopbar userName={profile?.full_name} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
