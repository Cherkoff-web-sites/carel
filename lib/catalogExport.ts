import ExcelJS from 'exceljs'
import { readCatalog } from '@/lib/catalogStore'
import { withCatalogProductExtras } from '@/lib/catalogProductExtras'
import { withCatalogProductDefaults } from '@/lib/catalogProductMeta'
import type { ComponentCatalogItem } from '@/lib/componentsCatalogData'
import type { CatalogFile, CatalogKey } from '@/lib/catalogTypes'
import { getComponentSiteUrl, getHumidifierSiteUrl } from '@/lib/adminCatalogFilters'

import type { CatalogExportItem } from '@/lib/catalogExportUrl'

function normalizeRow(product: Record<string, unknown>, _catalog: CatalogKey) {
  return withCatalogProductExtras(
    withCatalogProductDefaults(product as { description: string; price: number; image?: string })
  )
}

function siteUrl(catalog: CatalogKey, product: Record<string, unknown>): string {
  if (catalog === 'components') {
    return getComponentSiteUrl(product as ComponentCatalogItem)
  }
  if (catalog === 'humisteam') {
    return getHumidifierSiteUrl({
      catalogKey: 'humisteam',
      product: product as CatalogFile['humisteam'][number],
    })
  }
  return getHumidifierSiteUrl({
    catalogKey: 'heatersteam',
    product: product as CatalogFile['heatersteam'][number],
  })
}

export async function buildCatalogExcelBuffer(
  catalogFilter?: CatalogKey,
  itemFilter?: CatalogExportItem[]
): Promise<Buffer> {
  const data = await readCatalog()
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Каталог')
  const itemSet = itemFilter?.length
    ? new Set(itemFilter.map((item) => `${item.catalog}:${item.id}`))
    : null

  sheet.columns = [
    { header: 'Каталог', key: 'catalog', width: 14 },
    { header: 'ID', key: 'id', width: 22 },
    { header: 'SKU', key: 'sku', width: 18 },
    { header: 'Название', key: 'title', width: 36 },
    { header: 'Краткое описание', key: 'description', width: 40 },
    { header: 'Полное описание', key: 'fullDescription', width: 48 },
    { header: 'Цена', key: 'price', width: 12 },
    { header: 'Цена на сайте', key: 'showPriceOnSite', width: 14 },
    { header: 'Опубликован', key: 'published', width: 12 },
    { header: 'Главное фото', key: 'image', width: 36 },
    { header: 'Фото в галерее', key: 'galleryCount', width: 14 },
    { header: 'Вкладка Монтаж', key: 'tabInstallation', width: 14 },
    { header: 'Вкладка Серия', key: 'tabSeries', width: 14 },
    { header: 'Вкладка Документы', key: 'tabDocuments', width: 16 },
    { header: 'Вкладка Доставка', key: 'tabDelivery', width: 14 },
    { header: 'Вкладка Оплата', key: 'tabPayment', width: 14 },
    { header: 'PDF', key: 'pdfCount', width: 10 },
    { header: 'URL на сайте', key: 'siteUrl', width: 48 },
    { header: 'metaTitle', key: 'metaTitle', width: 32 },
    { header: 'metaDescription', key: 'metaDescription', width: 40 },
  ]

  const entries: Array<{ catalog: CatalogKey; product: Record<string, unknown> }> = []
  if (!catalogFilter || catalogFilter === 'humisteam') {
    for (const p of data.humisteam) {
      entries.push({ catalog: 'humisteam', product: p as unknown as Record<string, unknown> })
    }
  }
  if (!catalogFilter || catalogFilter === 'heatersteam') {
    for (const p of data.heatersteam) {
      entries.push({ catalog: 'heatersteam', product: p as unknown as Record<string, unknown> })
    }
  }
  if (!catalogFilter || catalogFilter === 'components') {
    for (const p of data.components) {
      entries.push({ catalog: 'components', product: p as unknown as Record<string, unknown> })
    }
  }

  for (const { catalog, product } of entries) {
    const p = product as { id: string; sku: string; title: string }
    if (itemSet && !itemSet.has(`${catalog}:${p.id}`)) {
      continue
    }
    const row = normalizeRow(product, catalog)
    sheet.addRow({
      catalog,
      id: p.id,
      sku: p.sku,
      title: p.title,
      description: row.description,
      fullDescription: row.fullDescription,
      price: row.price,
      showPriceOnSite: row.showPriceOnSite ? 'да' : 'нет',
      published: row.published ? 'да' : 'нет',
      image: row.image,
      galleryCount: row.galleryImages.length,
      tabInstallation: row.tabsEnabled.installation ? 'да' : 'нет',
      tabSeries: row.tabsEnabled.series ? 'да' : 'нет',
      tabDocuments: row.tabsEnabled.documents ? 'да' : 'нет',
      tabDelivery: row.tabsEnabled.delivery ? 'да' : 'нет',
      tabPayment: row.tabsEnabled.payment ? 'да' : 'нет',
      pdfCount: row.documents.length,
      siteUrl: siteUrl(catalog, product),
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

export function buildCatalogExportFilename(
  catalogFilter?: CatalogKey,
  itemFilter?: CatalogExportItem[]
): string {
  const stamp = new Date().toISOString().slice(0, 10)
  const suffix = itemFilter?.length
    ? '-filtered'
    : catalogFilter
      ? `-${catalogFilter}`
      : ''
  return `catalog${suffix}_${stamp}.xlsx`
}
