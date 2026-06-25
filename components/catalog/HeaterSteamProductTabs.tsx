'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import ComponentsSlider from '@/components/catalog/ComponentsSlider'
import DocumentsTabPanel from '@/components/catalog/DocumentsTabPanel'
import PlainTextTabPanel from '@/components/catalog/PlainTextTabPanel'
import { ChevronDownIcon } from '@/components/ui/ChevronIcon'
import { useSharedTabs } from '@/hooks/useSharedTabs'
import type { HeatersteamVariantId } from '@/lib/catalogData'
import { getComponentsForCatalogContext, type ComponentCatalogItem } from '@/lib/componentsCatalogData'
import {
  DEFAULT_TABS_ENABLED,
  getVisibleProductTabs,
  type ProductDocument,
  type ProductTabContent,
  type ProductTabsEnabled,
} from '@/lib/catalogProductExtras'
import {
  HUMISTEAM_DOCUMENTS_TEXT,
  HUMISTEAM_INSTALLATION_CONTENT,
  HUMISTEAM_PRODUCT_TABS,
  type HumiSteamProductTabId,
} from '@/lib/humisteamProductTabs'
import {
  getHeatersteamVariantNote,
  HEATERSTEAM_SERIES_TAB_CONTENT,
} from '@/lib/heatersteamSeriesContent'

type HeaterSteamProductTabsProps = {
  variantId: HeatersteamVariantId
  tabsEnabled?: Partial<ProductTabsEnabled>
  tabContent?: Partial<ProductTabContent>
  documents?: ProductDocument[]
}

export default function HeaterSteamProductTabs({
  variantId,
  tabsEnabled,
  tabContent,
  documents = [],
}: HeaterSteamProductTabsProps) {
  const enabled = useMemo(
    () => ({ ...DEFAULT_TABS_ENABLED, ...tabsEnabled }),
    [tabsEnabled]
  )
  const visibleTabs = useMemo(
    () => getVisibleProductTabs(HUMISTEAM_PRODUCT_TABS, enabled),
    [enabled]
  )
  const [activeTab, setActiveTab] = useState<HumiSteamProductTabId>(
    visibleTabs[0]?.id ?? 'installation'
  )
  const router = useRouter()
  const { tabs: sharedTabs } = useSharedTabs()

  const handleOpenComponent = (item: ComponentCatalogItem) => {
    router.push(`/components?id=${item.id}`)
  }

  return (
    <div className="mt-10 sm:mt-12">
      <div
        className="flex flex-wrap gap-2 sm:gap-3"
        role="tablist"
        aria-label="Информация о товаре"
      >
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-[5px] px-4 py-2.5 text-sm transition-colors sm:px-5 sm:py-3 sm:text-base ${
                isActive
                  ? 'bg-[#E62614] font-medium text-white'
                  : 'bg-[#e8e6e1] text-[#232326]/85 hover:bg-[#e8e6e1]/80'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        className="mt-6 min-w-0 text-sm leading-relaxed text-[#232326]/90 sm:mt-8 sm:text-base"
        role="tabpanel"
      >
        {activeTab === 'installation' ? (
          tabContent?.installationText?.trim() ? (
            <PlainTextTabPanel text={tabContent.installationText} />
          ) : (
            <InstallationTab />
          )
        ) : null}
        {activeTab === 'series' ? (
          tabContent?.seriesText?.trim() ? (
            <PlainTextTabPanel text={tabContent.seriesText} />
          ) : (
            <HeaterSteamSeriesTab variantId={variantId} onOpenComponent={handleOpenComponent} />
          )
        ) : null}
        {activeTab === 'documents' ? (
          <DocumentsTabPanel documents={documents} fallbackText={HUMISTEAM_DOCUMENTS_TEXT} />
        ) : null}
        {activeTab === 'delivery' ? (
          <PlainTextTabPanel text={sharedTabs?.deliveryText ?? ''} />
        ) : null}
        {activeTab === 'payment' ? (
          <PlainTextTabPanel text={sharedTabs?.paymentText ?? ''} />
        ) : null}
      </div>
    </div>
  )
}

function HeaterSteamSeriesTab({
  variantId,
  onOpenComponent,
}: {
  variantId: HeatersteamVariantId
  onOpenComponent: (item: ComponentCatalogItem) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const variantNote = getHeatersteamVariantNote(variantId)
  const components = getComponentsForCatalogContext(variantId)

  return (
    <div className="min-w-0">
      <p className="leading-relaxed text-[#232326]/90">{HEATERSTEAM_SERIES_TAB_CONTENT.preview}</p>

      {expanded ? (
        <div className="mt-4 space-y-4 leading-relaxed text-[#232326]/90">
          {HEATERSTEAM_SERIES_TAB_CONTENT.full.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          {variantNote ? <p>{variantNote}</p> : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#e8e6e1] px-4 py-3.5 text-base text-[#232326]/85 transition-colors hover:bg-[#e8e6e1]/80 sm:mt-6"
        aria-expanded={expanded}
      >
        {expanded ? 'свернуть' : 'читать далее'}
        <ChevronDownIcon
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <ComponentsSlider items={components} onOpenItem={onOpenComponent} />
    </div>
  )
}

function TabBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-relaxed text-[#232326]/90">
      <span
        className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E62614]"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  )
}

function InstallationTab() {
  const { title, intro, listHeading, listItems, emphasis, closing } =
    HUMISTEAM_INSTALLATION_CONTENT
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-[#232326] sm:text-2xl">{title}</h2>
      <p className="mt-4 leading-relaxed text-[#232326]/90 sm:mt-5">{intro}</p>
      <p className="mt-5 font-bold text-[#232326] sm:mt-6">{listHeading}</p>
      <ul className="mt-3 space-y-1.5 sm:space-y-2">
        {listItems.map((item) => (
          <TabBullet key={item}>{item}</TabBullet>
        ))}
      </ul>
      <p className="mt-5 font-bold leading-relaxed text-[#232326] sm:mt-6">{emphasis}</p>
      <p className="mt-5 leading-relaxed text-[#232326]/90 sm:mt-6">{closing}</p>
      <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
        <ContactModalTrigger className="inline-flex min-w-[200px] items-center justify-center rounded-[5px] bg-[#E62614] px-10 py-3 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90">
          Заказать монтаж
        </ContactModalTrigger>
      </div>
    </div>
  )
}
