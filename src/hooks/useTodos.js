import { useReducer, useEffect, useCallback } from 'react'
import { getTodos, saveTodos } from '../utils/storage'

function reducer(todos, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...todos,
        {
          id: crypto.randomUUID(),
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...action.payload,
        },
      ]
    case 'DELETE_TODO':
      return todos.filter((t) => t.id !== action.id)
    case 'TOGGLE_COMPLETE':
      return todos.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
      )
    case 'UPDATE_TODO':
      return todos.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload, updatedAt: Date.now() } : t
      )
    case 'CLEAR_COMPLETED':
      return todos.filter((t) => !t.completed)
    default:
      return todos
  }
}

export function useTodos() {
  const [todos, dispatch] = useReducer(reducer, undefined, getTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback((payload) => dispatch({ type: 'ADD_TODO', payload }), [])
  const deleteTodo = useCallback((id) => dispatch({ type: 'DELETE_TODO', id }), [])
  const toggleComplete = useCallback((id) => dispatch({ type: 'TOGGLE_COMPLETE', id }), [])
  const updateTodo = useCallback((payload) => dispatch({ type: 'UPDATE_TODO', payload }), [])
  const clearCompleted = useCallback(() => dispatch({ type: 'CLEAR_COMPLETED' }), [])

  return { todos, addTodo, deleteTodo, toggleComplete, updateTodo, clearCompleted }
}
