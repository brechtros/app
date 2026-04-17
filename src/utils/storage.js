import { STORAGE_KEY } from './constants'

export function getTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('localStorage is vol – wijzigingen worden niet opgeslagen.')
    }
  }
}
