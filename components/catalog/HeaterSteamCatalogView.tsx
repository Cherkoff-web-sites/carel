'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import CatalogFilterSelect from '@/components/catalog/CatalogFilterSelect'
import CatalogPerformanceGrid from '@/components/catalog/CatalogPerformanceGrid'
import CatalogImageSlider from '@/components/catalog/CatalogImageSlider'
import CatalogProductRow from '@/components/catalog/CatalogProductRow'
import HeaterSteamProductDetail from '@/components/catalog/HeaterSteamProductDetail'
import { catalogIdToHeatersteamVariantId, type HeatersteamVariantId } from '@/lib/catalogData'
import { heatersteamToCartItem } from '@/lib/cartFromProduct'
import {
  filterProducts,
  getHeaterSteamProductById,
  getHeaterSteamProductBySku,
  getProductsForVariant,
  getPerformanceOptions,
  getVariantLabel,
  getVariantsToDisplay,
  HEATERSTEAM_DESCRIPTION,
  HEATERSTEAM_GALLERY_IMAGES,
  HEATERSTEAM_PERFORMANCE_GRID,
  HEATERSTEAM_VARIANTS,
} from '@/lib/heatersteamData'

type HeaterSteamCatalogViewProps = {
  activeCatalogId: string
  onCatalogSelect: (id: string) => void
}

export default function HeaterSteamCatalogView({
  activeCatalogId,
  onCatalogSelect,
}: HeaterSteamCatalogViewProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedVariantId, setSelectedVariantId] = useState<HeatersteamVariantId | null>(() =>
    catalogIdToHeatersteamVariantId(activeCatalogId)
  )
  const [selectedPerformance, setSelectedPerformance] = useState<number | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const selectedProduct = useMemo(
    () => (selectedProductId ? getHeaterSteamProductById(selectedProductId) : undefined),
    [selectedProductId]
  )

  const updateProductUrl = useCallback(
    (product: { id: string; variantId: HeatersteamVariantId; sku: string } | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (product) {
        params.set('id', product.variantId)
        params.set('sku', product.sku)
      } else {
        params.delete('sku')
      }
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const openProduct = useCallback(
    (product: { id: string; variantId: HeatersteamVariantId; sku: string }) => {
      setSelectedProductId(product.id)
      updateProductUrl(product)
      onCatalogSelect(product.variantId)
      requestAnimationFrame(() => {
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [onCatalogSelect, updateProductUrl]
  )

  const closeProduct = useCallback(() => {
    setSelectedProductId(null)
    updateProductUrl(null)
  }, [updateProductUrl])

  useEffect(() => {
    if (activeCatalogId === 'heatersteam') {
      setSelectedVariantId(null)
      setSelectedPerformance(null)
      setSelectedProductId(null)
      return
    }
    const variant = catalogIdToHeatersteamVariantId(activeCatalogId)
    if (variant) {
      setSelectedVariantId(variant)
      setSelectedPerformance(null)
      if (!searchParams.get('sku')) {
        setSelectedProductId(null)
      }
    }
  }, [activeCatalogId, searchParams])

  useEffect(() => {
    const sku = searchParams.get('sku')
    if (!sku) {
      setSelectedProductId(null)
      return
    }
    const product = getHeaterSteamProductBySku(sku)
    if (!product) return
    setSelectedProductId(product.id)
    setSelectedVariantId(product.variantId)
    setSelectedPerformance(product.performanceKgH)
  }, [searchParams])

  useEffect(() => {
    if (!selectedProductId || selectedProduct) return
    setSelectedProductId(null)
    updateProductUrl(null)
  }, [selectedProduct, selectedProductId, updateProductUrl])

  const availablePerformanceValues = useMemo(
    () => getPerformanceOptions(selectedVariantId),
    [selectedVariantId]
  )

  const variantsToDisplay = getVariantsToDisplay(selectedVariantId)

  const handleVariantChange = (variantId: HeatersteamVariantId | null) => {
    setSelectedVariantId(variantId)
    setSelectedPerformance(null)
    closeProduct()
    if (variantId) {
      onCatalogSelect(variantId)
    } else {
      onCatalogSelect('heatersteam')
    }
  }

  const handlePerformanceChange = (performance: number | null) => {
    setSelectedPerformance(performance)
    closeProduct()
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const variantSelectOptions = HEATERSTEAM_VARIANTS.map((v) => ({
    value: v.id,
    label: v.label,
  }))

  if (selectedProduct) {
    const variantProducts = getProductsForVariant(selectedProduct.variantId)

    return (
      <article className="min-w-0" ref={listRef}>
        <HeaterSteamProductDetail
          product={selectedProduct}
          variantProducts={variantProducts}
          onBack={closeProduct}
          onSelectProduct={openProduct}
        />
      </article>
    )
  }

  return (
    <article className="min-w-0">
      <h1 className="mb-6 text-3xl font-normal text-[#232326] sm:mb-8 sm:text-4xl lg:text-5xl">
        heaterSteam
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <CatalogImageSlider images={HEATERSTEAM_GALLERY_IMAGES} alt="heaterSteam" />

        <div className="flex min-w-0 flex-col">
          <div className="space-y-4 text-sm leading-relaxed text-[#232326] sm:text-base">
            {HEATERSTEAM_DESCRIPTION.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <ContactModalTrigger className="mt-6 inline-flex w-auto items-center justify-center self-start rounded-[5px] bg-[#E62614] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90">
            Позвонить инженеру
          </ContactModalTrigger>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <CatalogFilterSelect
              label="Выберите модель"
              placeholder="Выберите модель"
              options={variantSelectOptions}
              value={selectedVariantId}
              onChange={handleVariantChange}
            />
            <CatalogPerformanceGrid
              label="Производительность"
              placeholder="Производительность"
              values={HEATERSTEAM_PERFORMANCE_GRID}
              availableValues={availablePerformanceValues}
              value={selectedPerformance}
              onChange={handlePerformanceChange}
            />
          </div>
        </div>
      </div>

      <div ref={listRef} className="mt-10 space-y-10 sm:mt-12">
        {variantsToDisplay.map((variantId) => {
          const products = filterProducts(variantId, selectedPerformance)
          if (products.length === 0) return null

          return (
            <section key={variantId}>
              <h2 className="mb-5 text-xl font-bold text-[#232326] sm:mb-6 sm:text-2xl">
                {getVariantLabel(variantId)}
              </h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <CatalogProductRow
                    key={product.id}
                    product={product}
                    onOpen={openProduct}
                    toCartItem={heatersteamToCartItem}
                  />
                ))}
              </div>
            </section>
          )
        })}

        {variantsToDisplay.every(
          (variantId) => filterProducts(variantId, selectedPerformance).length === 0
        ) ? (
          <p className="text-center text-base text-[#232326]/60">
            {selectedVariantId
              ? 'Нет моделей с выбранной производительностью. Сбросьте фильтр производительности.'
              : 'Выберите модель, чтобы увидеть доступные варианты.'}
          </p>
        ) : null}
      </div>
    </article>
  )
}
