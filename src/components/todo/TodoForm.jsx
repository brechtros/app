import { useState } from 'react'
import { PRIORITIES } from '../../utils/constants'
import { todayISO } from '../../utils/dateHelpers'

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [priority, setPriority] = useState('medium')
  const [labelsInput, setLabelsInput] = useState('')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    const labels = labelsInput
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)
    onAdd({ title: trimmed, priority, labels, dueDate: dueDate || null })
    setTitle('')
    setLabelsInput('')
    setDueDate('')
    setPriority('medium')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nieuwe todo toevoegen..."
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Meer opties"
          className={`p-2 rounded-lg border transition-colors ${expanded ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40"
          disabled={!title.trim()}
        >
          Toevoegen
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prioriteit</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Labels (komma-gescheiden)</label>
            <input
              type="text"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              placeholder="werk, persoonlijk..."
              className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Verloopdatum</label>
            <input
              type="date"
              value={dueDate}
              min={todayISO()}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      )}
    </form>
  )
}
