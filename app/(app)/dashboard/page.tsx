import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  INTERESTED: "bg-purple-100 text-purple-700",
  FOLLOW_UP: "bg-orange-100 text-orange-700",
  CONVERTED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const [total, newCount, followUp, converted, lost, recent, recentConverted] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "FOLLOW_UP" } }),
      prisma.lead.count({ where: { status: "CONVERTED" } }),
      prisma.lead.count({ where: { status: "LOST" } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.lead.findMany({
        where: { status: "CONVERTED" },
        orderBy: { convertedDate: "desc" },
        take: 5,
      }),
    ]);

  const cards = [
    { label: "Total Leads", value: total, color: "text-gray-900" },
    { label: "New Leads", value: newCount, color: "text-blue-600" },
    { label: "Follow-up Leads", value: followUp, color: "text-orange-600" },
    { label: "Converted Leads", value: converted, color: "text-green-600" },
    { label: "Lost Leads", value: lost, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Recent 5 Leads</h2>
            <Link href="/leads" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-500">Abhi koi lead nahi hai.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((l) => (
                <li key={l.id} className="py-2 flex items-center justify-between text-sm">
                  <Link href={`/leads/${l.id}`} className="text-gray-900 hover:underline">
                    {l.name}
                  </Link>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[l.status]}`}>
                    {l.status.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Converted Leads</h2>
          {recentConverted.length === 0 ? (
            <p className="text-sm text-gray-500">Abhi koi converted lead nahi hai.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentConverted.map((l) => (
                <li key={l.id} className="py-2 flex items-center justify-between text-sm">
                  <Link href={`/leads/${l.id}`} className="text-gray-900 hover:underline">
                    {l.name}
                  </Link>
                  <span className="text-gray-500">
                    {l.convertedDate ? l.convertedDate.toLocaleDateString() : "-"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}