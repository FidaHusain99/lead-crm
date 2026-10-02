import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Valid email daalo"),
  password: z.string().min(1, "Password daalo"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const admin = await prisma.admin.findUnique({ where: { email } });
    const valid = admin ? await bcrypt.compare(password, admin.password) : false;

    if (!admin || !valid) {
      return NextResponse.json(
        { error: "Email ya password galat hai" },
        { status: 401 }
      );
    }

    await createSession(admin.id, admin.email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}