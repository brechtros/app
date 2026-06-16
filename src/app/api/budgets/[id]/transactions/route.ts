import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const budget = await prisma.budget.findFirst({ where: { id, userId: session.user.id } });
  if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const transactions = await prisma.transaction.findMany({
    where: { budgetId: id },
    include: { category: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const budget = await prisma.budget.findFirst({ where: { id, userId: session.user.id } });
  if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(body.amount),
      type: body.type,
      description: body.description,
      date: new Date(body.date),
      budgetId: id,
      categoryId: body.categoryId || null,
    },
    include: { category: true },
  });
  return NextResponse.json(transaction);
}
