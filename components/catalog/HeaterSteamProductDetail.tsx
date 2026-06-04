'use client'

import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import CatalogAllModelsSelect from '@/components/catalog/CatalogAllModelsSelect'
import CatalogImageSlider from '@/components/catalog/CatalogImageSlider'
import HeaterSteamProductTabs from '@/components/catalog/HeaterSteamProductTabs'
import { heatersteamToCartItem } from '@/lib/cartFromProduct'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import { HEATERSTEAM_GALLERY_IMAGES } from '@/lib/heatersteamData'
import {
  getHeaterSteamProductDisplayName,
  getHeaterSteamProductSpecRows,
  getHeaterSteamProductSubtitle,
} from '@/lib/heatersteamProductSpecs'

const SITE_PHONE_HREF = 'tel:+79295385634'

type HeaterSteamProductDetailProps = {
  product: HeaterSteamProduct
  variantProducts: HeaterSteamProduct[]
  onBack: () => void
  onSelectProduct: (product: HeaterSteamProduct) => void
}

function PhoneIconButton() {
  return (
    <a
      href={SITE_PHONE_HREF}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#232326] text-white transition-colors hover:bg-[#232326]/85 sm:h-11 sm:w-11"
      aria-label="Позвонить"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
          fill="currentColor"
        />
      </svg>
    </a>
  )
}

export default function HeaterSteamProductDetail({
  product,
  variantProducts,
  onBack,
  onSelectProduct,
}: HeaterSteamProductDetailProps) {
  const specRows = getHeaterSteamProductSpecRows(product)
  const displayName = getHeaterSteamProductDisplayName(product.sku)

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[#232326]/60 transition-colors hover:text-[#E62614] sm:mb-6 sm:text-base"
      >
        <span aria-hidden>←</span>
        К списку моделей
      </button>

      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-bold leading-tight text-[#232326] sm:text-3xl lg:text-4xl">
          {displayName}
        </h1>
        <p className="mt-2 text-base text-[#232326]/65 sm:text-lg">
          {getHeaterSteamProductSubtitle(product)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <CatalogImageSlider images={HEATERSTEAM_GALLERY_IMAGES} alt={displayName} />

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#232326] sm:text-xl">Характеристики:</h2>

          <dl className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
            {specRows.map((row) => (
              <div key={row.label} className="text-sm sm:text-base">
                <dt className="inline text-[#232326]/50">{row.label}</dt>{' '}
                <dd className="inline font-normal text-[#232326]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <p className="text-base text-[#232326] sm:text-lg">
              <span className="text-[#232326]/50">Цена:</span>{' '}
              <span className="font-bold">по запросу</span>
            </p>
            <PhoneIconButton />
          </div>

          <div className="mt-5 flex w-auto flex-col items-start gap-4 sm:mt-6">
            <CatalogAllModelsSelect
              products={variantProducts}
              currentProductId={product.id}
              onSelect={onSelectProduct}
            />

            <ContactModalTrigger className="inline-flex w-auto items-center justify-center rounded-[5px] bg-[#E62614] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90">
              Заявка на сервис
            </ContactModalTrigger>
          </div>
        </div>
      </div>

      <HeaterSteamProductTabs variantId={product.variantId} />
    </div>
  )
}
