import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LeadForm from "@/app/components/LeadForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditLeadPage({ params }: Props) {
  const { id } = await params;
  const leadId = Number(id);
  if (Number.isNaN(leadId)) notFound();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Lead</h1>
      <LeadForm
        leadId={lead.id}
        initial={{
          name: lead.name,
          mobile: lead.mobile,
          email: lead.email,
          company: lead.company ?? "",
          source: lead.source,
          status: lead.status,
          notes: lead.notes ?? "",
          followUpDate: lead.followUpDate
            ? lead.followUpDate.toISOString().slice(0, 10)
            : "",
        }}
      />
    </div>
  );
}