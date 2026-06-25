'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PublicPriceFields } from '@/lib/catalogProductMeta'
import type { CatalogKey } from '@/lib/catalogTypes'
import type { ComponentCatalogItem } from '@/lib/componentsCatalogData'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import type { HumiSteamProduct } from '@/lib/humisteamData'

type CatalogProductsState<T> = {
  products: T[]
  loading: boolean
  error: string | null
  reload: () => void
}

type CatalogProductByKey = {
  humisteam: HumiSteamProduct & PublicPriceFields
  heatersteam: HeaterSteamProduct & PublicPriceFields
  components: ComponentCatalogItem & PublicPriceFields
}

export function useCatalogProducts<K extends CatalogKey>(
  catalog: K
): CatalogProductsState<CatalogProductByKey[K]> {
  const [products, setProducts] = useState<CatalogProductByKey[K][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catalog/${catalog}`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Не удалось загрузить каталог')
      }
      const data = (await response.json()) as CatalogProductByKey[K][]
      setProducts(data)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [catalog])

  useEffect(() => {
    void load()
  }, [load])

  return { products, loading, error, reload: load }
}
