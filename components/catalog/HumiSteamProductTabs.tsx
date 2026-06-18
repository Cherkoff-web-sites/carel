'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import ComponentsSlider from '@/components/catalog/ComponentsSlider'
import { HUMISTEAM_MODEL_IDS, type HumisteamModelId } from '@/lib/catalogData'
import {
  getComponentsForCatalogContexts,
  type ComponentCatalogItem,
} from '@/lib/componentsCatalogData'
import {
  HUMISTEAM_DELIVERY_CONTENT,
  HUMISTEAM_DOCUMENTS_TEXT,
  HUMISTEAM_INSTALLATION_CONTENT,
  HUMISTEAM_PAYMENT_CONTENT,
  HUMISTEAM_PRODUCT_TABS,
  type HumiSteamProductTabId,
} from '@/lib/humisteamProductTabs'
import { getAllHumiSteamSeriesLines, HUMISTEAM_SERIES_INTRO } from '@/lib/humisteamSeriesContent'
import { HUMISTEAM_PRODUCT_IMAGE } from '@/lib/humisteamData'

type HumiSteamProductTabsProps = {
  modelId: HumisteamModelId
}

export default function HumiSteamProductTabs({ modelId }: HumiSteamProductTabsProps) {
  const [activeTab, setActiveTab] = useState<HumiSteamProductTabId>('installation')
  const router = useRouter()

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
        {HUMISTEAM_PRODUCT_TABS.map((tab) => {
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
        {activeTab === 'installation' ? <InstallationTab /> : null}
        {activeTab === 'series' ? <SeriesTab onOpenComponent={handleOpenComponent} /> : null}
        {activeTab === 'documents' ? <SimpleTextTab text={HUMISTEAM_DOCUMENTS_TEXT} /> : null}
        {activeTab === 'delivery' ? <DeliveryTab /> : null}
        {activeTab === 'payment' ? <PaymentTab /> : null}
      </div>
    </div>
  )
}

function SimpleTextTab({ text }: { text: string }) {
  return <p>{text}</p>
}

function SeriesTab({
  onOpenComponent,
}: {
  onOpenComponent: (item: ComponentCatalogItem) => void
}) {
  const lines = getAllHumiSteamSeriesLines()
  const components = getComponentsForCatalogContexts([...HUMISTEAM_MODEL_IDS])

  return (
    <div className="min-w-0">
      <h2 className="text-xl font-bold leading-snug text-[#232326] sm:text-2xl">
        {HUMISTEAM_SERIES_INTRO.title}
      </h2>
      <p className="mt-4 leading-relaxed text-[#232326]/90 sm:mt-5">{HUMISTEAM_SERIES_INTRO.text}</p>

      <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
        {lines.map((line) => (
          <section key={line.heading}>
            <h3 className="text-lg font-bold text-[#232326] sm:text-xl">{line.heading}</h3>
            <p className="mt-4 leading-relaxed text-[#232326]/90">{line.text}</p>
          </section>
        ))}
      </div>

      <p className="mt-8 leading-relaxed text-[#232326]/90 sm:mt-10">{HUMISTEAM_SERIES_INTRO.outro}</p>

      <div className="relative mx-auto mt-8 aspect-[3/4] w-full max-w-[280px] sm:mt-10 sm:max-w-[320px] lg:max-w-[360px]">
        <Image
          src={HUMISTEAM_PRODUCT_IMAGE}
          alt="humiSteam"
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 80vw, 360px"
        />
      </div>

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

function PaymentTab() {
  const { individuals, legal } = HUMISTEAM_PAYMENT_CONTENT

  return (
    <div className="max-w-3xl space-y-8 sm:space-y-10">
      <section>
        <h2 className="text-xl font-bold text-[#232326] sm:text-2xl">{individuals.title}</h2>
        <p className="mt-4 leading-relaxed text-[#232326]/90 sm:mt-5">{individuals.intro}</p>
        <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
          {individuals.methods.map((method) => (
            <TabBullet key={method}>{method}</TabBullet>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#232326] sm:text-2xl">{legal.title}</h2>
        <p className="mt-4 leading-relaxed text-[#232326]/90 sm:mt-5">{legal.text}</p>
      </section>
    </div>
  )
}

function DeliveryTab() {
  const { moscow, russia } = HUMISTEAM_DELIVERY_CONTENT

  return (
    <div className="max-w-3xl space-y-8 sm:space-y-10">
      <section>
        <h2 className="text-xl font-bold text-[#232326] sm:text-2xl">{moscow.title}</h2>

        <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
          <TabBullet>
            <strong className="font-bold text-[#232326]">{moscow.rates[0].bold}</strong>
            {moscow.rates[0].text}
          </TabBullet>
          <TabBullet>
            {moscow.rates[1].text}
            <strong className="font-bold text-[#232326]">{moscow.rates[1].boldEnd}</strong>
          </TabBullet>
        </ul>

        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-[#E62614] sm:mt-5 sm:text-base">
          <span>{moscow.schedule.days}</span>
          <span>{moscow.schedule.hours}</span>
        </p>

        <p className="mt-3 text-[#232326]/90 sm:mt-4">{moscow.driverNote}</p>

        <ul className="mt-3 sm:mt-4">
          <TabBullet>
            {moscow.outsideMkad.text}
            <strong className="font-bold text-[#232326]">{moscow.outsideMkad.bold}</strong>
          </TabBullet>
        </ul>

        <p className="mt-5 text-[#232326] sm:mt-6">{moscow.lifting.title}</p>
        <ul className="mt-2 space-y-2 sm:space-y-2.5">
          {moscow.lifting.items.map((item) => (
            <TabBullet key={item}>{item}</TabBullet>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#232326] sm:text-2xl">{russia.title}</h2>
        <p className="mt-1 text-sm text-[#232326]/55 sm:text-base">{russia.subtitle}</p>

        <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
          {russia.rates.map((item) => (
            <TabBullet key={item}>{item}</TabBullet>
          ))}
        </ul>

        <p className="mt-5 font-bold text-[#232326] sm:mt-6">{russia.closing}</p>
      </section>
    </div>
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
          <li key={item} className="flex gap-2.5 leading-relaxed text-[#232326]/90">
            <span
              className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E62614]"
              aria-hidden
            />
            <span>{item}</span>
          </li>
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
