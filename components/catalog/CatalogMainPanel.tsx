'use client'

import CatalogCategoryView from '@/components/catalog/CatalogCategoryView'
import CatalogOverview from '@/components/catalog/CatalogOverview'
import HeaterSteamCatalogView from '@/components/catalog/HeaterSteamCatalogView'
import HumiSteamCatalogView from '@/components/catalog/HumiSteamCatalogView'
import {
  findCatalogNodeById,
  CATALOG_TREE,
  isCatalogCategoryId,
  isHeatersteamCatalogId,
  isHumisteamCatalogId,
} from '@/lib/catalogData'

type CatalogMainPanelProps = {
  activeId: string | null
  onCatalogSelect: (id: string) => void
  onNavigate: (id: string) => void
}

export default function CatalogMainPanel({
  activeId,
  onCatalogSelect,
  onNavigate,
}: CatalogMainPanelProps) {
  if (!activeId) {
    return <CatalogOverview onSelect={onNavigate} />
  }

  if (isCatalogCategoryId(activeId)) {
    return <CatalogCategoryView categoryId={activeId} onSelect={onNavigate} />
  }

  const activeNode = findCatalogNodeById(CATALOG_TREE, activeId)

  if (!activeNode) {
    return (
      <div className="flex min-h-[280px] flex-1 items-center justify-center text-center text-[#232326]/60 sm:min-h-[360px]">
        <p className="max-w-sm text-base sm:text-lg">
          Выберите раздел в каталоге слева
        </p>
      </div>
    )
  }

  if (isHumisteamCatalogId(activeId)) {
    return (
      <HumiSteamCatalogView
        activeCatalogId={activeId}
        onCatalogSelect={onCatalogSelect}
      />
    )
  }

  if (isHeatersteamCatalogId(activeId)) {
    return (
      <HeaterSteamCatalogView
        activeCatalogId={activeId}
        onCatalogSelect={onCatalogSelect}
      />
    )
  }

  return (
    <article className="min-w-0">
      <h1 className="mb-6 text-2xl text-[#232326] sm:text-3xl lg:text-4xl">{activeNode.label}</h1>
      <p className="text-base leading-relaxed text-[#232326]/80 sm:text-lg">
        Раздел «{activeNode.label}». Контент и карточки товаров будут добавлены.
      </p>
    </article>
  )
}
