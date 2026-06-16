"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, Euro } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface DashboardData {
  budgetCount: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgets: Array<{ id: string; name: string; type: string; color: string; income: number; expenses: number }>;
}

const BUDGET_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Persoonlijk",
  PROJECT: "Project",
  BUSINESS: "Zakelijk",
  SAVINGS: "Spaardoel",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(amount);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const now = new Date();
  const monthName = now.toLocaleString("nl-BE", { month: "long", year: "numeric" });

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);

  const chartData = data?.budgets.map(b => ({
    name: b.name,
    Inkomsten: b.income,
    Uitgaven: b.expenses,
  })) || [];

  const pieData = data?.budgets
    .filter(b => b.expenses > 0)
    .map(b => ({ name: b.name, value: b.expenses, color: b.color })) || [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 mt-1">Overzicht voor {monthName}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Budgetten", value: String(data?.budgetCount ?? "—"), icon: Wallet, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Inkomsten", value: data ? formatCurrency(data.totalIncome) : "—", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Uitgaven", value: data ? formatCurrency(data.totalExpenses) : "—", icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Saldo", value: data ? formatCurrency(data.balance) : "—", icon: Euro, color: data && data.balance >= 0 ? "text-green-400" : "text-red-400", bg: data && data.balance >= 0 ? "bg-green-500/10" : "bg-red-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{label}</span>
              <div className={`${bg} p-2 rounded-lg`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Inkomsten vs Uitgaven per budget</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={v => `€${v}`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="Inkomsten" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Uitgaven" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">Geen data beschikbaar</div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Uitgaven per budget</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
                <Legend formatter={(value) => <span style={{ color: "#9ca3af", fontSize: 12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">Geen uitgaven deze maand</div>
          )}
        </div>
      </div>

      {data?.budgets && data.budgets.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Budgetoverzicht deze maand</h3>
          <div className="space-y-3">
            {data.budgets.map(b => {
              const pct = b.income > 0 ? Math.round((b.expenses / b.income) * 100) : 0;
              return (
                <div key={b.id} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white truncate">{b.name}</span>
                      <span className="text-xs text-gray-400 ml-4">{BUDGET_TYPE_LABELS[b.type]}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="text-green-400">+{formatCurrency(b.income)}</span>
                      <span className="text-red-400">-{formatCurrency(b.expenses)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
