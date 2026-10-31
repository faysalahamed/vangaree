import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, phone, password, location } = body;

  if (!name || !phone || !password) {
    return NextResponse.json({ error: "name, phone and password are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: "An account with this phone number already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, phone, passwordHash, location }
  });

  return NextResponse.json({ id: user.id, name: user.name, phone: user.phone }, { status: 201 });
}
