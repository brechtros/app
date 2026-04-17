import { PRIORITIES } from '../../utils/constants'
import { LabelBadge } from '../ui/Badge'

export function Sidebar({ todos, activeLabel, onLabelClick }) {
  const labelCounts = {}
  todos.forEach((t) => t.labels.forEach((l) => {
    labelCounts[l] = (labelCounts[l] || 0) + 1
  }))
  const labels = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])

  const priorityCounts = { high: 0, medium: 0, low: 0 }
  todos.filter((t) => !t.completed).forEach((t) => {
    priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1
  })

  if (labels.length === 0 && Object.values(priorityCounts).every((c) => c === 0)) return null

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
      {labels.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Labels</p>
          <div className="flex flex-wrap gap-1.5">
            {labels.map(([label, count]) => (
              <div key={label} className="flex items-center gap-1">
                <LabelBadge
                  label={label}
                  active={activeLabel === label}
                  onClick={() => onLabelClick(activeLabel === label ? null : label)}
                />
                <span className="text-xs text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Prioriteit (actief)</p>
        <div className="flex gap-3">
          {PRIORITIES.map((p) => (
            <div key={p.value} className="flex items-center gap-1.5">
              <span className={`inline-block w-2 h-2 rounded-full ${p.colorClass.split(' ')[0].replace('bg-', 'bg-').replace('100', '400')}`} />
              <span className="text-xs text-gray-600">{p.label}</span>
              <span className="text-xs font-semibold text-gray-800">{priorityCounts[p.value]}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
