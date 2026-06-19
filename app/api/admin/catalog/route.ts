import { NextRequest, NextResponse } from 'next/server'
import { getCatalogProducts, updateCatalogProduct } from '@/lib/catalogStore'
import type { CatalogKey, ComponentsPatch, HeatersteamPatch, HumisteamPatch } from '@/lib/catalogTypes'

const VALID_CATALOGS = new Set<CatalogKey>(['humisteam', 'heatersteam', 'components'])

export async function GET(request: NextRequest) {
  const catalog = request.nextUrl.searchParams.get('catalog') as CatalogKey | null

  if (!catalog || !VALID_CATALOGS.has(catalog)) {
    return NextResponse.json({ error: 'catalog query is required' }, { status: 400 })
  }

  const products = await getCatalogProducts(catalog)
  return NextResponse.json(products)
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const catalog = body.catalog as CatalogKey | undefined
    const id = body.id as string | undefined
    const patch = body.patch as HumisteamPatch | HeatersteamPatch | ComponentsPatch | undefined

    if (!catalog || !VALID_CATALOGS.has(catalog) || !id || !patch) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const updated = await updateCatalogProduct(catalog, id, patch)
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product: updated })
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
