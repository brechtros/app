import { useState, useEffect } from 'react'
import { PriorityBadge, LabelBadge } from '../ui/Badge'
import { isOverdue, formatDate } from '../../utils/dateHelpers'

export function TodoItem({ todo, onToggle, onDelete, onEdit, onLabelClick, activeLabel }) {
  const [pendingDelete, setPendingDelete] = useState(false)

  useEffect(() => {
    if (!pendingDelete) return
    const timer = setTimeout(() => setPendingDelete(false), 2000)
    return () => clearTimeout(timer)
  }, [pendingDelete])

  function handleDelete() {
    if (pendingDelete) {
      onDelete(todo.id)
    } else {
      setPendingDelete(true)
    }
  }

  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate)

  return (
    <div className={`group bg-white rounded-xl border transition-all animate-slide-in ${todo.completed ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-indigo-200 hover:shadow-sm'}`}>
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Markeer als actief' : 'Markeer als voltooid'}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium break-words ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {todo.title}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <PriorityBadge priority={todo.priority} />

            {todo.labels.map((l) => (
              <LabelBadge
                key={l}
                label={l}
                active={activeLabel === l}
                onClick={() => onLabelClick(l)}
              />
            ))}

            {todo.dueDate && (
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                overdue
                  ? 'bg-red-50 text-red-600 border-red-200 font-semibold'
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {overdue ? 'Verlopen · ' : ''}{formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            aria-label="Bewerken"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label={pendingDelete ? 'Bevestig verwijderen' : 'Verwijderen'}
            className={`p-1.5 rounded-lg transition-colors ${
              pendingDelete
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {pendingDelete && (
        <div className="px-4 pb-3 text-xs text-red-500 text-right">
          Klik nogmaals om te verwijderen
        </div>
      )}
    </div>
  )
}
