import { NextRequest, NextResponse } from 'next/server'
import {
  buildCatalogExcelBuffer,
  buildCatalogExportFilename,
} from '@/lib/catalogExport'
import { parseCatalogExportItems } from '@/lib/catalogExportUrl'
import type { CatalogKey } from '@/lib/catalogTypes'

const VALID = new Set<CatalogKey>(['humisteam', 'heatersteam', 'components'])

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const catalogParam = request.nextUrl.searchParams.get('catalog')
  const catalog =
    catalogParam && VALID.has(catalogParam as CatalogKey)
      ? (catalogParam as CatalogKey)
      : undefined
  const itemFilter = parseCatalogExportItems(request.nextUrl.searchParams.get('items'))

  const buffer = await buildCatalogExcelBuffer(catalog, itemFilter)
  const filename = buildCatalogExportFilename(catalog, itemFilter)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
