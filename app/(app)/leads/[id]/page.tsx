import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const leadId = Number(id);
  if (Number.isNaN(leadId)) notFound();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) notFound();

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Mobile", lead.mobile],
    ["Email", lead.email],
    ["Company", lead.company || "-"],
    ["Lead Source", lead.source],
    ["Status", lead.status.replace("_", " ")],
    ["Follow-up Date", lead.followUpDate ? lead.followUpDate.toLocaleDateString() : "-"],
    ["Converted Date", lead.convertedDate ? lead.convertedDate.toLocaleDateString() : "-"],
    ["Created", lead.createdAt.toLocaleDateString()],
    ["Notes", lead.notes || "-"],
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
        <div className="space-x-3">
          <Link href={`/leads/${lead.id}/edit`} className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm">
            Edit
          </Link>
          <Link href="/leads" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700">
            Back
          </Link>
        </div>
      </div>
      <dl className="max-w-2xl bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
            <dt className="text-gray-500">{k}</dt>
            <dd className="col-span-2 text-gray-900 whitespace-pre-wrap">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}