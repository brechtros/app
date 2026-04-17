import { PRIORITIES } from '../../utils/constants'

const PRIORITY_STYLES = Object.fromEntries(PRIORITIES.map((p) => [p.value, p.colorClass]))

export function PriorityBadge({ priority }) {
  const p = PRIORITIES.find((x) => x.value === priority)
  if (!p) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${PRIORITY_STYLES[priority]}`}>
      {p.label}
    </span>
  )
}

export function LabelBadge({ label, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}
