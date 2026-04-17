export const PRIORITIES = [
  { value: 'high', label: 'Hoog', colorClass: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: 'Midden', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: 'Laag', colorClass: 'bg-blue-100 text-blue-700 border-blue-200' },
]

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Nieuwste eerst' },
  { value: 'createdAt_asc', label: 'Oudste eerst' },
  { value: 'dueDate_asc', label: 'Verloopdatum' },
  { value: 'priority_asc', label: 'Prioriteit' },
  { value: 'title_asc', label: 'Alfabetisch' },
]

export const STATUS_FILTERS = [
  { value: 'all', label: 'Alle' },
  { value: 'active', label: 'Actief' },
  { value: 'completed', label: 'Voltooid' },
]

export const STORAGE_KEY = 'todos-app-v1'
