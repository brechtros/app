import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
    include: {
      transactions: {
        where: { date: { gte: startOfMonth, lte: endOfMonth } },
      },
      categories: {
        include: {
          transactions: {
            where: { date: { gte: startOfMonth, lte: endOfMonth } },
          },
        },
      },
    },
  });

  const totalIncome = budgets.reduce((sum, b) =>
    sum + b.transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0), 0);
  const totalExpenses = budgets.reduce((sum, b) =>
    sum + b.transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0), 0);

  return NextResponse.json({
    budgetCount: budgets.length,
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    budgets: budgets.map(b => ({
      id: b.id,
      name: b.name,
      type: b.type,
      color: b.color,
      income: b.transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
      expenses: b.transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    })),
  });
}
