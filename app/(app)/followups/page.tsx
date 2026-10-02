import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type LeadRow = {
  id: number;
  name: string;
  mobile: string;
  status: string;
  followUpDate: Date | null;
};

function Section({
  title,
  color,
  leads,
  empty,
}: {
  title: string;
  color: string;
  leads: LeadRow[];
  empty: string;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-semibold ${color}`}>{title}</h2>
        <span className="text-sm text-gray-500">{leads.length}</span>
      </div>
      {leads.length === 0 ? (
        <p className="text-sm text-gray-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {leads.map((l) => (
            <li key={l.id} className="py-2 flex items-center justify-between text-sm gap-3">
              <div>
                <Link href={`/leads/${l.id}`} className="font-medium text-gray-900 hover:underline">
                  {l.name}
                </Link>
                <div className="text-xs text-gray-500">{l.mobile}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-700">
                  {l.followUpDate ? l.followUpDate.toLocaleDateString() : "-"}
                </div>
                <div className="text-xs text-gray-500">{l.status.replace("_", " ")}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function FollowupsPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const active = {
    followUpDate: { not: null },
    status: { notIn: ["CONVERTED", "LOST"] as ("CONVERTED" | "LOST")[] },
  };

  const [overdue, today, upcoming] = await Promise.all([
    prisma.lead.findMany({
      where: { ...active, followUpDate: { lt: startOfToday } },
      orderBy: { followUpDate: "asc" },
    }),
    prisma.lead.findMany({
      where: { ...active, followUpDate: { gte: startOfToday, lt: startOfTomorrow } },
      orderBy: { followUpDate: "asc" },
    }),
    prisma.lead.findMany({
      where: { ...active, followUpDate: { gte: startOfTomorrow } },
      orderBy: { followUpDate: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section title="Overdue" color="text-red-600" leads={overdue} empty="Koi overdue follow-up nahi." />
        <Section title="Today's Follow-ups" color="text-orange-600" leads={today} empty="Aaj koi follow-up nahi." />
        <Section title="Upcoming" color="text-blue-600" leads={upcoming} empty="Koi upcoming follow-up nahi." />
      </div>
    </div>
  );
}