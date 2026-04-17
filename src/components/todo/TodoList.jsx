import { TodoItem } from './TodoItem'
import { EmptyState } from '../ui/EmptyState'

export function TodoList({ todos, allTodosCount, onToggle, onDelete, onEdit, onLabelClick, activeLabel }) {
  if (todos.length === 0) {
    return <EmptyState filtered={allTodosCount > 0} />
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onLabelClick={onLabelClick}
          activeLabel={activeLabel}
        />
      ))}
    </div>
  )
}
