'use client'

import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import CatalogAllModelsSelect from '@/components/catalog/CatalogAllModelsSelect'
import CatalogImageSlider from '@/components/catalog/CatalogImageSlider'
import HeaterSteamProductTabs from '@/components/catalog/HeaterSteamProductTabs'
import ProductDetailCartIconButton from '@/components/product/ProductDetailCartIconButton'
import ProductDetailPhoneButton from '@/components/product/ProductDetailPhoneButton'
import { ChevronLeftIcon } from '@/components/ui/ChevronIcon'
import { heatersteamToCartItem } from '@/lib/cartFromProduct'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import { HEATERSTEAM_GALLERY_IMAGES } from '@/lib/heatersteamData'
import {
  getHeaterSteamProductDisplayName,
  getHeaterSteamProductSpecRows,
  getHeaterSteamProductSubtitle,
} from '@/lib/heatersteamProductSpecs'

type HeaterSteamProductDetailProps = {
  product: HeaterSteamProduct
  variantProducts: HeaterSteamProduct[]
  onBack: () => void
  onSelectProduct: (product: HeaterSteamProduct) => void
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
        <ChevronLeftIcon />
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
            <ProductDetailPhoneButton />
          </div>

          <div className="mt-5 flex w-auto flex-col items-start gap-4 sm:mt-6">
            <CatalogAllModelsSelect
              products={variantProducts}
              currentProductId={product.id}
              onSelect={onSelectProduct}
            />

            <div className="flex w-full max-w-md items-stretch gap-2">
              <ContactModalTrigger className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-[5px] bg-[#E62614] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90">
                Заявка на сервис
              </ContactModalTrigger>
              <ProductDetailCartIconButton
                getCartItem={() => heatersteamToCartItem(product)}
                ariaLabel={`Добавить ${product.sku} в корзину`}
              />
            </div>
          </div>
        </div>
      </div>

      <HeaterSteamProductTabs variantId={product.variantId} />
    </div>
  )
}
