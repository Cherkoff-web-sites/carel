import { NextRequest, NextResponse } from 'next/server'
import { bulkUpdateCatalogProducts } from '@/lib/catalogStore'
import type { CatalogKey, CatalogProductPatch } from '@/lib/catalogTypes'

const VALID_CATALOGS = new Set<CatalogKey>(['humisteam', 'heatersteam', 'components'])

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const items = body.items as Array<{ catalog: CatalogKey; id: string }> | undefined
    const patch = body.patch as CatalogProductPatch | undefined

    if (!items?.length || !patch) {
      return NextResponse.json({ error: 'items and patch are required' }, { status: 400 })
    }

    for (const item of items) {
      if (!VALID_CATALOGS.has(item.catalog) || !item.id) {
        return NextResponse.json({ error: 'Invalid item in list' }, { status: 400 })
      }
    }

    const updated = await bulkUpdateCatalogProducts(items, patch)
    return NextResponse.json({ success: true, updated })
  } catch {
    return NextResponse.json({ error: 'Bulk update failed' }, { status: 500 })
  }
}
