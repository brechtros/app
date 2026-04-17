import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { PRIORITIES } from '../../utils/constants'

export function TodoEditModal({ todo, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [labelsInput, setLabelsInput] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setPriority(todo.priority)
      setLabelsInput(todo.labels.join(', '))
      setDueDate(todo.dueDate || '')
    }
  }, [todo])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    const labels = labelsInput
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)
    onSave({ ...todo, title: trimmed, priority, labels, dueDate: dueDate || null })
    onClose()
  }

  return (
    <Modal isOpen={!!todo} onClose={onClose} title="Todo bewerken">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Prioriteit</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Verloopdatum</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40"
          >
            Opslaan
          </button>
        </div>
      </form>
    </Modal>
  )
}
