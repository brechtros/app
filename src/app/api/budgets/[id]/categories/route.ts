import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const budget = await prisma.budget.findFirst({ where: { id, userId: session.user.id } });
  if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      color: body.color || "#6b7280",
      limit: body.limit ? parseFloat(body.limit) : null,
      budgetId: id,
    },
  });
  return NextResponse.json(category);
}
