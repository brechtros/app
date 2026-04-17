export function isOverdue(dateString) {
  if (!dateString) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateString) < today
}

export function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}
