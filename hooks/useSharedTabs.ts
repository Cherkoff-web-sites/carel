'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SharedTabsData } from '@/lib/sharedTabsDefaults'

export function useSharedTabs() {
  const [tabs, setTabs] = useState<SharedTabsData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/catalog/shared-tabs', { cache: 'no-store' })
      if (!response.ok) throw new Error('load failed')
      setTabs((await response.json()) as SharedTabsData)
    } catch {
      setTabs(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { tabs, loading, reload: load }
}
