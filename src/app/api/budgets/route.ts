import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
    include: {
      categories: true,
      _count: { select: { transactions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const budget = await prisma.budget.create({
    data: {
      name: body.name,
      type: body.type,
      description: body.description,
      currency: body.currency || "EUR",
      targetAmount: body.targetAmount ? parseFloat(body.targetAmount) : null,
      color: body.color || "#3b82f6",
      userId: session.user.id,
    },
  });
  return NextResponse.json(budget);
}
