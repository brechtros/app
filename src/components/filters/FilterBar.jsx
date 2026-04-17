import { STATUS_FILTERS, PRIORITIES } from '../../utils/constants'
import { LabelBadge } from '../ui/Badge'

export function FilterBar({ status, setStatus, priority, setPriority, label, setLabel, availableLabels }) {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-3">
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatus(f.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              status === f.value
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1">
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPriority(priority === p.value ? null : p.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              priority === p.value
                ? p.colorClass
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {availableLabels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {availableLabels.map((l) => (
            <LabelBadge
              key={l}
              label={l}
              active={label === l}
              onClick={() => setLabel(label === l ? null : l)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
