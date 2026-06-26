import { NextResponse } from 'next/server'
import { getCatalogProducts } from '@/lib/catalogStore'
import type { CatalogKey } from '@/lib/catalogTypes'

const VALID_CATALOGS = new Set<CatalogKey>(['humisteam', 'heatersteam', 'components'])

type RouteParams = { params: { catalog: string } }

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: RouteParams) {
  const catalog = params.catalog as CatalogKey

  if (!VALID_CATALOGS.has(catalog)) {
    return NextResponse.json({ error: 'Unknown catalog' }, { status: 404 })
  }

  const products = await getCatalogProducts(catalog, {
    publishedOnly: true,
    forPublic: true,
  })
  return NextResponse.json(products, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
