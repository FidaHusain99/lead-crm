import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { leadSchema } from "@/lib/validations";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
  if (!lead) {
    return NextResponse.json({ error: "Lead nahi mila" }, { status: 404 });
  }
  return NextResponse.json(lead);
}

export async function PUT(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.lead.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Lead nahi mila" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const d = parsed.data;

    let convertedDate = existing.convertedDate;
    if (d.status === "CONVERTED" && existing.status !== "CONVERTED") {
      convertedDate = new Date();
    } else if (d.status !== "CONVERTED") {
      convertedDate = null;
    }

    const lead = await prisma.lead.update({
      where: { id: Number(id) },
      data: {
        name: d.name,
        mobile: d.mobile,
        email: d.email,
        company: d.company || null,
        source: d.source,
        status: d.status,
        notes: d.notes || null,
        followUpDate: d.followUpDate ? new Date(d.followUpDate) : null,
        convertedDate,
      },
    });

    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.lead.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lead nahi mila" }, { status: 404 });
  }
}