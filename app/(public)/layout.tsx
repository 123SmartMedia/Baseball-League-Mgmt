import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen">{children}</main>
      <PublicFooter />
    </>
  );
}
