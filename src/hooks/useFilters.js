import { useState } from 'react'

export function useFilters() {
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState(null)
  const [label, setLabel] = useState(null)
  const [sortKey, setSortKey] = useState('createdAt_desc')

  return { status, setStatus, priority, setPriority, label, setLabel, sortKey, setSortKey }
}
