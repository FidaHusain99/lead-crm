import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/app/components/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="md:flex min-h-screen bg-gray-50">
      <Sidebar email={session.email} />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}