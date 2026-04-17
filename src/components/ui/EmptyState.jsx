export function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg className="w-16 h-16 mb-4 opacity-40" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth={1.5}>
        <rect x="8" y="12" width="48" height="44" rx="4" />
        <line x1="20" y1="26" x2="44" y2="26" />
        <line x1="20" y1="34" x2="44" y2="34" />
        <line x1="20" y1="42" x2="36" y2="42" />
      </svg>
      <p className="text-lg font-medium">
        {filtered ? 'Geen todos gevonden' : 'Nog geen todos'}
      </p>
      <p className="text-sm mt-1">
        {filtered ? 'Pas de filters aan om meer te zien.' : 'Voeg je eerste todo toe hierboven.'}
      </p>
    </div>
  )
}
