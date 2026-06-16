"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Plus, Trash2, TrendingUp, TrendingDown, Tag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Category {
  id: string;
  name: string;
  color: string;
  limit?: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  date: string;
  category?: Category;
}

interface Budget {
  id: string;
  name: string;
  type: string;
  color: string;
  currency: string;
  targetAmount?: number;
  categories: Category[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(amount);
}

export default function BudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [txForm, setTxForm] = useState({
    amount: "",
    type: "EXPENSE",
    description: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
  });
  const [catForm, setCatForm] = useState({ name: "", color: "#6b7280", limit: "" });

  function loadData() {
    fetch(`/api/budgets/${id}`).then(r => r.json()).then(setBudget);
    fetch(`/api/budgets/${id}/transactions`).then(r => r.json()).then(setTransactions);
  }

  useEffect(() => { loadData(); }, [id]);

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const monthlyData = (() => {
    const months: Record<string, { income: number; expenses: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = format(d, "MMM", { locale: nl });
      months[key] = { income: 0, expenses: 0 };
    }
    transactions.forEach(t => {
      const d = new Date(t.date);
      const now = new Date();
      const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diffMonths >= 0 && diffMonths <= 5) {
        const key = format(d, "MMM", { locale: nl });
        if (months[key]) {
          if (t.type === "INCOME") months[key].income += t.amount;
          else months[key].expenses += t.amount;
        }
      }
    });
    return Object.entries(months).map(([name, v]) => ({
      name,
      Inkomsten: v.income,
      Uitgaven: v.expenses,
    }));
  })();

  const categorySpending = budget?.categories.map(cat => {
    const spent = transactions
      .filter(t => t.type === "EXPENSE" && t.category?.id === cat.id)
      .reduce((s, t) => s + t.amount, 0);
    return { ...cat, spent };
  }) || [];

  async function handleCreateTransaction(e: React.FormEvent) {
    e.preventDefault();
    setTxLoading(true);
    await fetch(`/api/budgets/${id}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(txForm),
    });
    setShowTxModal(false);
    setTxForm({
      amount: "",
      type: "EXPENSE",
      description: "",
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
    });
    loadData();
    setTxLoading(false);
  }

  async function handleDeleteTransaction(txId: string) {
    await fetch(`/api/budgets/${id}/transactions/${txId}`, { method: "DELETE" });
    loadData();
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatLoading(true);
    await fetch(`/api/budgets/${id}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catForm),
    });
    setShowCatModal(false);
    setCatForm({ name: "", color: "#6b7280", limit: "" });
    loadData();
    setCatLoading(false);
  }

  if (!budget) return <div className="p-8 text-gray-400">Laden...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/budgets" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">{budget.name}</h2>
          <p className="text-gray-400 mt-0.5 text-sm">Alle transacties</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Tag size={15} />Categorie
          </button>
          <button
            onClick={() => setShowTxModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={15} />Transactie
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-2">Totale inkomsten</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-2">Totale uitgaven</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-2">Saldo</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Monthly chart */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Afgelopen 6 maanden</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={v => `€${v}`} />
              <Tooltip
                formatter={(v) => formatCurrency(Number(v))}
                contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }}
              />
              <Bar dataKey="Inkomsten" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Uitgaven" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Categorieën</h3>
          {categorySpending.length === 0 ? (
            <p className="text-gray-500 text-sm">Nog geen categorieën</p>
          ) : (
            <div className="space-y-3">
              {categorySpending.map(cat => {
                const pct = cat.limit ? Math.min(100, (cat.spent / cat.limit) * 100) : null;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs font-medium text-gray-300">{cat.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatCurrency(cat.spent)}</span>
                    </div>
                    {pct !== null && (
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                    {cat.limit && (
                      <p className="text-xs text-gray-600 mt-0.5">Limiet: {formatCurrency(cat.limit)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-5 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Transacties ({transactions.length})</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">Nog geen transacties. Voeg er een toe om te beginnen.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="flex items-center px-5 py-3.5 hover:bg-gray-800/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                    tx.type === "INCOME" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}
                >
                  {tx.type === "INCOME" ? (
                    <TrendingUp size={15} className="text-green-400" />
                  ) : (
                    <TrendingDown size={15} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {format(new Date(tx.date), "d MMM yyyy", { locale: nl })}
                    </span>
                    {tx.category && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded text-gray-300"
                        style={{ backgroundColor: tx.category.color + "33" }}
                      >
                        {tx.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`font-semibold text-sm ml-4 ${
                    tx.type === "INCOME" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                </span>
                <button
                  onClick={() => handleDeleteTransaction(tx.id)}
                  className="ml-3 text-gray-600 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction modal */}
      {showTxModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Transactie toevoegen</h3>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTxForm(f => ({ ...f, type: "EXPENSE" }))}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    txForm.type === "EXPENSE"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  Uitgave
                </button>
                <button
                  type="button"
                  onClick={() => setTxForm(f => ({ ...f, type: "INCOME" }))}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    txForm.type === "INCOME"
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  Inkomst
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Omschrijving</label>
                <input
                  value={txForm.description}
                  onChange={e => setTxForm(f => ({ ...f, description: e.target.value }))}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="bv. Boodschappen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Bedrag (€)</label>
                <input
                  type="number"
                  value={txForm.amount}
                  onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))}
                  required
                  step="0.01"
                  min="0.01"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Datum</label>
                <input
                  type="date"
                  value={txForm.date}
                  onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {budget.categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Categorie (optioneel)</label>
                  <select
                    value={txForm.categoryId}
                    onChange={e => setTxForm(f => ({ ...f, categoryId: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Geen categorie</option>
                    {budget.categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={txLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                >
                  {txLoading ? "Bezig..." : "Toevoegen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Categorie toevoegen</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Naam</label>
                <input
                  value={catForm.name}
                  onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="bv. Boodschappen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Kleur</label>
                <input
                  type="color"
                  value={catForm.color}
                  onChange={e => setCatForm(f => ({ ...f, color: e.target.value }))}
                  className="h-10 w-full rounded-lg cursor-pointer bg-gray-800 border border-gray-700 p-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Budgetlimiet (€, optioneel)
                </label>
                <input
                  type="number"
                  value={catForm.limit}
                  onChange={e => setCatForm(f => ({ ...f, limit: e.target.value }))}
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={catLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                >
                  {catLoading ? "Bezig..." : "Toevoegen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
