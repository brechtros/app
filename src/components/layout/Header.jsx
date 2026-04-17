export function Header({ activeCount, completedCount, onClearCompleted }) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mijn Todos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeCount} {activeCount === 1 ? 'taak' : 'taken'} te doen
          </p>
        </div>
        {completedCount > 0 && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
          >
            Verwijder {completedCount} voltooide {completedCount === 1 ? 'taak' : 'taken'}
          </button>
        )}
      </div>
    </header>
  )
}
