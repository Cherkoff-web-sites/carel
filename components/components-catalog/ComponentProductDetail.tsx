'use client'

import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import { ChevronLeftIcon } from '@/components/ui/ChevronIcon'
import CatalogImageSlider from '@/components/catalog/CatalogImageSlider'
import CatalogAllModelsSelect from '@/components/catalog/CatalogAllModelsSelect'
import ComponentProductTabs from '@/components/components-catalog/ComponentProductTabs'
import ProductDetailCartIconButton from '@/components/product/ProductDetailCartIconButton'
import ProductDetailPhoneButton from '@/components/product/ProductDetailPhoneButton'
import {
  componentToCartItem,
  type ComponentCatalogItem,
} from '@/lib/componentsCatalogData'
import { formatPublicSitePrice, type PublicPriceFields } from '@/lib/catalogProductMeta'

import { type CatalogProductExtrasFields } from '@/lib/catalogProductExtras'

import {
  getComponentGalleryImages,
  getComponentProductSpecRows,
  getComponentProductTitle,
} from '@/lib/componentProductSpecs'

type ComponentCatalogProduct = ComponentCatalogItem & PublicPriceFields & CatalogProductExtrasFields

type ComponentProductDetailProps = {
  product: ComponentCatalogProduct
  sectionProducts: ComponentCatalogProduct[]
  onBack: () => void
  onSelectProduct: (product: ComponentCatalogProduct) => void
}

export default function ComponentProductDetail({
  product,
  sectionProducts,
  onBack,
  onSelectProduct,
}: ComponentProductDetailProps) {
  const specRows = getComponentProductSpecRows(product)
  const displayName = getComponentProductTitle(product)
  const galleryImages = getComponentGalleryImages(product)

  const variantProducts = sectionProducts.map((item) => ({
    ...item,
    title: item.sku,
  }))

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[#232326]/60 transition-colors hover:text-[#E62614] sm:mb-6 sm:text-base"
      >
        <ChevronLeftIcon />
        К списку товаров
      </button>

      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-bold leading-tight text-[#232326] sm:text-3xl lg:text-4xl">
          {displayName}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <CatalogImageSlider images={galleryImages} alt={displayName} />

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
              <span className="font-bold">{formatPublicSitePrice(product)}</span>
            </p>
            <ProductDetailPhoneButton />
          </div>

          <div className="mt-5 flex w-auto flex-col items-start gap-4 sm:mt-6">
            {variantProducts.length > 1 ? (
              <CatalogAllModelsSelect
                products={variantProducts}
                currentProductId={product.id}
                onSelect={onSelectProduct}
                triggerLabel="Все варианты"
              />
            ) : null}

            <div className="flex w-full max-w-md items-stretch gap-2">
              <ContactModalTrigger className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-[5px] bg-[#E62614] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90">
                Заявка на сервис
              </ContactModalTrigger>
              <ProductDetailCartIconButton
                getCartItem={() => componentToCartItem(product)}
                ariaLabel={`Добавить ${product.sku} в корзину`}
              />
            </div>
          </div>
        </div>
      </div>

      <ComponentProductTabs
        sectionId={product.sectionId}
        tabsEnabled={product.tabsEnabled}
        tabContent={product.tabContent}
        documents={product.documents}
      />
    </div>
  )
}
