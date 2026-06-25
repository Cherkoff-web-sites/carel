import { NextRequest, NextResponse } from 'next/server'
import {
  createCatalogProduct,
  deleteCatalogProduct,
  duplicateCatalogProduct,
  getCatalogProducts,
  updateCatalogProduct,
} from '@/lib/catalogStore'
import type { CatalogKey, CatalogProductPatch } from '@/lib/catalogTypes'

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
    const patch = body.patch as CatalogProductPatch | undefined

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const catalog = body.catalog as CatalogKey | undefined
    const action = body.action as 'create' | 'duplicate' | undefined
    const id = body.id as string | undefined

    if (!catalog || !VALID_CATALOGS.has(catalog) || !action) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (action === 'duplicate') {
      if (!id) {
        return NextResponse.json({ error: 'id is required for duplicate' }, { status: 400 })
      }
      const product = await duplicateCatalogProduct(catalog, id)
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, product })
    }

    const product = await createCatalogProduct(catalog, {
      templateId: id,
      sectionId: body.sectionId as string | undefined,
      modelId: body.modelId as string | undefined,
      variantId: body.variantId as string | undefined,
    })
    return NextResponse.json({ success: true, product })
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const catalog = request.nextUrl.searchParams.get('catalog') as CatalogKey | null
    const id = request.nextUrl.searchParams.get('id')

    if (!catalog || !VALID_CATALOGS.has(catalog) || !id) {
      return NextResponse.json({ error: 'catalog and id are required' }, { status: 400 })
    }

    const deleted = await deleteCatalogProduct(catalog, id)
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
