import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { leadSchema, LEAD_STATUSES } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || "";
  const status = searchParams.get("status") || "";

  const leads = await prisma.lead.findMany({
    where: {
      ...(status && (LEAD_STATUSES as readonly string[]).includes(status)
        ? { status: status as (typeof LEAD_STATUSES)[number] }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { mobile: { contains: search } },
              { company: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const lead = await prisma.lead.create({
      data: {
        name: d.name,
        mobile: d.mobile,
        email: d.email,
        company: d.company || null,
        source: d.source,
        status: d.status,
        notes: d.notes || null,
        followUpDate: d.followUpDate ? new Date(d.followUpDate) : null,
        convertedDate: d.status === "CONVERTED" ? new Date() : null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}