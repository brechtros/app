"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { nl } from "date-fns/locale";

interface Budget {
  id: string;
  name: string;
  color: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  description: string;
  category?: { id: string; name: string; color: string };
  budgetId: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(amount);
}

export default function ReportsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/budgets")
      .then(r => r.json())
      .then((bs: Budget[]) => {
        setBudgets(bs);
        Promise.all(
          bs.map(b =>
            fetch(`/api/budgets/${b.id}/transactions`)
              .then(r => r.json())
              .then((txs: Transaction[]) => txs.map(t => ({ ...t, budgetId: b.id })))
          )
        ).then(all => setAllTransactions(all.flat()));
      });
  }, []);

  const transactions =
    selectedBudget === "all"
      ? allTransactions
      : allTransactions.filter(t => t.budgetId === selectedBudget);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    const filtered = transactions.filter(t => {
      const td = new Date(t.date);
      return td >= start && td <= end;
    });
    return {
      name: format(d, "MMM", { locale: nl }),
      Inkomsten: filtered.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
      Uitgaven: filtered.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    };
  });

  const catMap: Record<string, { name: string; color: string; total: number }> = {};
  transactions
    .filter(t => t.type === "EXPENSE" && t.category)
    .forEach(t => {
      const cat = t.category!;
      if (!catMap[cat.id]) catMap[cat.id] = { name: cat.name, color: cat.color, total: 0 };
      catMap[cat.id].total += t.amount;
    });
  const pieData = Object.values(catMap).sort((a, b) => b.total - a.total).slice(0, 8);

  const uncategorized = transactions
    .filter(t => t.type === "EXPENSE" && !t.category)
    .reduce((s, t) => s + t.amount, 0);
  if (uncategorized > 0) pieData.push({ name: "Geen categorie", color: "#6b7280", total: uncategorized });

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Rapporten</h2>
          <p className="text-gray-400 mt-1">Analyse van je financiën</p>
        </div>
        <select
          value={selectedBudget}
          onChange={e => setSelectedBudget(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Alle budgetten</option>
          {budgets.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Totale inkomsten</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Totale uitgaven</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-base font-semibold text-white mb-4">Evolutie afgelopen 6 maanden</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={v => `€${v}`} />
            <Tooltip
              formatter={(v) => formatCurrency(Number(v))}
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }}
            />
            <Area type="monotone" dataKey="Inkomsten" stroke="#22c55e" fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="Uitgaven" stroke="#ef4444" fill="url(#expensesGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Uitgaven per categorie</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="total"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }}
                />
                <Legend formatter={value => <span style={{ color: "#9ca3af", fontSize: 12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-500 text-sm">
              Geen uitgaven met categorieën
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Verdeling per categorie</h3>
          <div className="space-y-3">
            {pieData.map((cat, i) => {
              const pct = totalExpenses > 0 ? ((cat.total / totalExpenses) * 100).toFixed(1) : "0";
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300 truncate">{cat.name}</span>
                      <span className="text-sm font-medium text-white ml-2">{formatCurrency(cat.total)}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                </div>
              );
            })}
            {pieData.length === 0 && (
              <p className="text-gray-500 text-sm">Geen data beschikbaar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
