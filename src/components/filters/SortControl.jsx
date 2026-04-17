import { SORT_OPTIONS } from '../../utils/constants'

export function SortControl({ sortKey, setSortKey }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Sorteren op</label>
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
