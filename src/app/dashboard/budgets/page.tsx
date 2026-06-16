"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Wallet, Trash2, ArrowRight } from "lucide-react";

interface Budget {
  id: string;
  name: string;
  type: string;
  description?: string;
  color: string;
  currency: string;
  targetAmount?: number;
  _count?: { transactions: number };
}

const BUDGET_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Persoonlijk",
  PROJECT: "Project",
  BUSINESS: "Zakelijk",
  SAVINGS: "Spaardoel",
};

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", type: "PERSONAL", description: "", color: COLORS[0], targetAmount: "" });

  function loadBudgets() {
    fetch("/api/budgets").then(r => r.json()).then(setBudgets);
  }

  useEffect(() => { loadBudgets(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ name: "", type: "PERSONAL", description: "", color: COLORS[0], targetAmount: "" });
    loadBudgets();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Budget verwijderen? Alle transacties worden ook verwijderd.")) return;
    await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    loadBudgets();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Budgetten</h2>
          <p className="text-gray-400 mt-1">{budgets.length} budget{budgets.length !== 1 ? "ten" : ""}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} />
          Nieuw budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-20">
          <Wallet size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">Nog geen budgetten</p>
          <p className="text-gray-600 text-sm mt-1">Maak je eerste budget aan om te beginnen</p>
          <button onClick={() => setShowModal(true)} className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg mx-auto transition-colors">
            <Plus size={16} />Budget aanmaken
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {budgets.map(budget => (
            <div key={budget.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: budget.color + "22" }}>
                    <Wallet size={20} style={{ color: budget.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{budget.name}</h3>
                    <span className="text-xs text-gray-500">{BUDGET_TYPE_LABELS[budget.type]}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(budget.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
              {budget.description && <p className="text-gray-500 text-sm mb-4">{budget.description}</p>}
              {budget.targetAmount && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Doelbedrag</p>
                  <p className="text-sm font-medium text-white">€{budget.targetAmount.toFixed(2)}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{budget._count?.transactions ?? 0} transacties</span>
                <Link href={`/dashboard/budgets/${budget.id}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                  Bekijken <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Nieuw budget aanmaken</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Naam</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="bv. Huishoudbudget" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="PERSONAL">Persoonlijk</option>
                  <option value="PROJECT">Project</option>
                  <option value="BUSINESS">Zakelijk</option>
                  <option value="SAVINGS">Spaardoel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Omschrijving (optioneel)</label>
                <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Korte omschrijving..." />
              </div>
              {form.type === "SAVINGS" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Doelbedrag (€)</label>
                  <input type="number" value={form.targetAmount} onChange={e => setForm(f => ({...f, targetAmount: e.target.value}))} step="0.01" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kleur</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({...f, color: c}))} className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110" : ""}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors">Annuleren</button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors">
                  {loading ? "Bezig..." : "Aanmaken"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
