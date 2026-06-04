'use client'

import { useState, type ReactNode } from 'react'
import {
  COMPONENT_DELIVERY_CONTENT,
  COMPONENT_DOCUMENTS_TEXT,
  COMPONENT_PAYMENT_CONTENT,
  COMPONENT_PRODUCT_TABS,
  type ComponentProductTabId,
} from '@/lib/componentProductTabs'
import { getComponentSeriesTabParagraphs } from '@/lib/componentProductSpecs'

type ComponentProductTabsProps = {
  sectionId: string
}

function SimpleTextTab({ text }: { text: string }) {
  return <p>{text}</p>
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

function DeliveryTab() {
  const { moscow, russia } = COMPONENT_DELIVERY_CONTENT

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

function PaymentTab() {
  const { individuals, legal } = COMPONENT_PAYMENT_CONTENT

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

export default function ComponentProductTabs({ sectionId }: ComponentProductTabsProps) {
  const [activeTab, setActiveTab] = useState<ComponentProductTabId>('series')

  return (
    <div className="mt-10 sm:mt-12">
      <div
        className="flex flex-wrap gap-2 sm:gap-3"
        role="tablist"
        aria-label="Информация о товаре"
      >
        {COMPONENT_PRODUCT_TABS.map((tab) => {
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
        {activeTab === 'series' ? <SeriesTab sectionId={sectionId} /> : null}
        {activeTab === 'documents' ? <SimpleTextTab text={COMPONENT_DOCUMENTS_TEXT} /> : null}
        {activeTab === 'delivery' ? <DeliveryTab /> : null}
        {activeTab === 'payment' ? <PaymentTab /> : null}
      </div>
    </div>
  )
}
