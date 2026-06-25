'use client'

import { useMemo, useState } from 'react'
import DocumentsTabPanel from '@/components/catalog/DocumentsTabPanel'
import PlainTextTabPanel from '@/components/catalog/PlainTextTabPanel'
import { useSharedTabs } from '@/hooks/useSharedTabs'
import {
  DEFAULT_TABS_ENABLED,
  getVisibleProductTabs,
  type ProductDocument,
  type ProductTabContent,
  type ProductTabId,
  type ProductTabsEnabled,
} from '@/lib/catalogProductExtras'
import {
  COMPONENT_DOCUMENTS_TEXT,
  COMPONENT_PRODUCT_TABS,
  type ComponentProductTabId,
} from '@/lib/componentProductTabs'
import { getComponentSeriesTabParagraphs } from '@/lib/componentProductSpecs'

type ComponentProductTabsProps = {
  sectionId: string
  tabsEnabled?: Partial<ProductTabsEnabled>
  tabContent?: Partial<ProductTabContent>
  documents?: ProductDocument[]
}

function SeriesTab({ sectionId }: { sectionId: string }) {
  const paragraphs = getComponentSeriesTabParagraphs(sectionId)

  return (
    <div className="max-w-3xl space-y-4 sm:space-y-5">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="leading-relaxed text-[#232326]/90">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

export default function ComponentProductTabs({
  sectionId,
  tabsEnabled,
  tabContent,
  documents = [],
}: ComponentProductTabsProps) {
  const enabled = useMemo(
    () => ({ ...DEFAULT_TABS_ENABLED, ...tabsEnabled }),
    [tabsEnabled]
  )
  const visibleTabs = useMemo(
    () =>
      getVisibleProductTabs(
        COMPONENT_PRODUCT_TABS.map((tab) => ({
          id: tab.id as ProductTabId,
          label: tab.label,
        })),
        enabled
      ),
    [enabled]
  )
  const [activeTab, setActiveTab] = useState<ComponentProductTabId>(
    (visibleTabs[0]?.id as ComponentProductTabId) ?? 'series'
  )
  const { tabs: sharedTabs } = useSharedTabs()

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
              onClick={() => setActiveTab(tab.id as ComponentProductTabId)}
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
        {activeTab === 'series' ? (
          tabContent?.seriesText?.trim() ? (
            <PlainTextTabPanel text={tabContent.seriesText} />
          ) : (
            <SeriesTab sectionId={sectionId} />
          )
        ) : null}
        {activeTab === 'documents' ? (
          <DocumentsTabPanel documents={documents} fallbackText={COMPONENT_DOCUMENTS_TEXT} />
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
