import { useMemo, useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { useFilters } from './hooks/useFilters'
import { PRIORITY_ORDER } from './utils/constants'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { TodoForm } from './components/todo/TodoForm'
import { TodoList } from './components/todo/TodoList'
import { TodoEditModal } from './components/todo/TodoEditModal'
import { FilterBar } from './components/filters/FilterBar'
import { SortControl } from './components/filters/SortControl'

function filterTodos(todos, { status, priority, label }) {
  return todos.filter((t) => {
    if (status === 'active' && t.completed) return false
    if (status === 'completed' && !t.completed) return false
    if (priority && t.priority !== priority) return false
    if (label && !t.labels.includes(label)) return false
    return true
  })
}

function sortTodos(todos, sortKey) {
  const copy = [...todos]
  switch (sortKey) {
    case 'createdAt_asc':
      return copy.sort((a, b) => a.createdAt - b.createdAt)
    case 'dueDate_asc':
      return copy.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
    case 'priority_asc':
      return copy.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    case 'title_asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title, 'nl'))
    case 'createdAt_desc':
    default:
      return copy.sort((a, b) => b.createdAt - a.createdAt)
  }
}

export default function App() {
  const { todos, addTodo, deleteTodo, toggleComplete, updateTodo, clearCompleted } = useTodos()
  const { status, setStatus, priority, setPriority, label, setLabel, sortKey, setSortKey } = useFilters()
  const [editingTodo, setEditingTodo] = useState(null)

  const availableLabels = useMemo(
    () => [...new Set(todos.flatMap((t) => t.labels))].sort(),
    [todos]
  )

  const visibleTodos = useMemo(
    () => sortTodos(filterTodos(todos, { status, priority, label }), sortKey),
    [todos, status, priority, label, sortKey]
  )

  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos])
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos])

  function handleLabelClick(clickedLabel) {
    setLabel(label === clickedLabel ? null : clickedLabel)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Header
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />

        <Sidebar
          todos={todos}
          activeLabel={label}
          onLabelClick={handleLabelClick}
        />

        <TodoForm onAdd={addTodo} />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <FilterBar
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
            label={label}
            setLabel={setLabel}
            availableLabels={availableLabels}
          />
          <SortControl sortKey={sortKey} setSortKey={setSortKey} />
        </div>

        <TodoList
          todos={visibleTodos}
          allTodosCount={todos.length}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onEdit={setEditingTodo}
          onLabelClick={handleLabelClick}
          activeLabel={label}
        />

        <TodoEditModal
          todo={editingTodo}
          onSave={updateTodo}
          onClose={() => setEditingTodo(null)}
        />
      </div>
    </div>
  )
}
