'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import CatalogFilterSelect from '@/components/catalog/CatalogFilterSelect'
import CatalogPerformanceGrid from '@/components/catalog/CatalogPerformanceGrid'
import CatalogImageSlider from '@/components/catalog/CatalogImageSlider'
import CatalogProductRow from '@/components/catalog/CatalogProductRow'
import { humisteamToCartItem } from '@/lib/cartFromProduct'
import { scrollToPageTop } from '@/lib/scrollToPageTop'
import HumiSteamProductDetail from '@/components/catalog/HumiSteamProductDetail'
import {
  catalogIdToModelId,
  type HumisteamModelId,
} from '@/lib/catalogData'
import {
  filterProducts,
  getHumiSteamProductById,
  getHumiSteamProductBySku,
  getModelLabel,
  getModelsToDisplay,
  getPerformanceOptions,
  getProductsForModel,
  HUMISTEAM_DESCRIPTION,
  HUMISTEAM_GALLERY_IMAGES,
  HUMISTEAM_MODELS,
  HUMISTEAM_PERFORMANCE_GRID,
} from '@/lib/humisteamData'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'

type HumiSteamCatalogViewProps = {
  activeCatalogId: string
  onCatalogSelect: (id: string) => void
}

export default function HumiSteamCatalogView({
  activeCatalogId,
  onCatalogSelect,
}: HumiSteamCatalogViewProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedModelId, setSelectedModelId] = useState<HumisteamModelId | null>(() =>
    catalogIdToModelId(activeCatalogId)
  )
  const [selectedPerformance, setSelectedPerformance] = useState<number | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const { products, loading } = useCatalogProducts('humisteam')

  const selectedProduct = useMemo(
    () => (selectedProductId ? getHumiSteamProductById(products, selectedProductId) : undefined),
    [products, selectedProductId]
  )

  const updateProductUrl = useCallback(
    (product: { id: string; modelId: HumisteamModelId; sku: string } | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (product) {
        params.set('id', product.modelId)
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
    (product: { id: string; modelId: HumisteamModelId; sku: string }) => {
      setSelectedProductId(product.id)
      updateProductUrl(product)
      onCatalogSelect(product.modelId)
    },
    [onCatalogSelect, updateProductUrl]
  )

  const closeProduct = useCallback(() => {
    setSelectedProductId(null)
    updateProductUrl(null)
  }, [updateProductUrl])

  useEffect(() => {
    if (activeCatalogId === 'humisteam') {
      setSelectedModelId(null)
      setSelectedPerformance(null)
      setSelectedProductId(null)
      return
    }
    const model = catalogIdToModelId(activeCatalogId)
    if (model) {
      setSelectedModelId(model)
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
    const product = getHumiSteamProductBySku(products, sku)
    if (!product) {
      return
    }
    setSelectedProductId(product.id)
    setSelectedModelId(product.modelId)
    setSelectedPerformance(product.performanceKgH)
  }, [products, searchParams])

  useEffect(() => {
    if (!selectedProduct) {
      return
    }
    scrollToPageTop()
  }, [selectedProduct?.id])

  useEffect(() => {
    if (!selectedProductId || selectedProduct) {
      return
    }
    setSelectedProductId(null)
    updateProductUrl(null)
  }, [selectedProduct, selectedProductId, updateProductUrl])

  const availablePerformanceValues = useMemo(
    () => getPerformanceOptions(products, selectedModelId),
    [products, selectedModelId]
  )

  const modelsToDisplay = getModelsToDisplay(selectedModelId)

  if (loading && products.length === 0) {
    return <p className="text-[#232326]/60">Загрузка каталога…</p>
  }

  const handleModelChange = (modelId: HumisteamModelId | null) => {
    setSelectedModelId(modelId)
    setSelectedPerformance(null)
    closeProduct()
    if (modelId) {
      onCatalogSelect(modelId)
    } else {
      onCatalogSelect('humisteam')
    }
  }

  const handlePerformanceChange = (performance: number | null) => {
    setSelectedPerformance(performance)
    closeProduct()
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const modelSelectOptions = HUMISTEAM_MODELS.map((m) => ({
    value: m.id,
    label: m.label,
  }))

  if (selectedProduct) {
    const modelProducts = getProductsForModel(products, selectedProduct.modelId)

    return (
      <article className="min-w-0">
        <HumiSteamProductDetail
          product={selectedProduct}
          modelProducts={modelProducts}
          onBack={closeProduct}
          onSelectProduct={openProduct}
        />
      </article>
    )
  }

  return (
    <article className="min-w-0">
      <h1 className="mb-6 text-3xl font-normal text-[#232326] sm:mb-8 sm:text-4xl lg:text-5xl">
        humiSteam
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <CatalogImageSlider images={HUMISTEAM_GALLERY_IMAGES} alt="humiSteam" />

        <div className="flex min-w-0 flex-col">
          <div className="space-y-4 text-sm leading-relaxed text-[#232326] sm:text-base">
            {HUMISTEAM_DESCRIPTION.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <ContactModalTrigger
            modalView="call"
            className="mt-6 inline-flex w-auto items-center justify-center self-start rounded-[5px] bg-[#E62614] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90"
          >
            Позвонить инженеру
          </ContactModalTrigger>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <CatalogFilterSelect
              label="Выберите модель"
              placeholder="Выберите модель"
              options={modelSelectOptions}
              value={selectedModelId}
              onChange={handleModelChange}
            />
            <CatalogPerformanceGrid
              label="Производительность"
              placeholder="Производительность"
              values={HUMISTEAM_PERFORMANCE_GRID}
              availableValues={availablePerformanceValues}
              value={selectedPerformance}
              onChange={handlePerformanceChange}
            />
          </div>
        </div>
      </div>

      <div ref={listRef} className="mt-10 space-y-10 sm:mt-12">
        {modelsToDisplay.map((modelId) => {
          const modelProducts = filterProducts(products, modelId, selectedPerformance)
          if (modelProducts.length === 0) {
            return null
          }

          return (
            <section key={modelId}>
              <h2 className="mb-5 text-xl font-bold text-[#232326] sm:mb-6 sm:text-2xl">
                {getModelLabel(modelId)}
              </h2>
              <div className="space-y-4">
                {modelProducts.map((product) => (
                  <CatalogProductRow
                    key={product.id}
                    product={product}
                    onOpen={openProduct}
                    toCartItem={humisteamToCartItem}
                  />
                ))}
              </div>
            </section>
          )
        })}

        {modelsToDisplay.every(
          (modelId) => filterProducts(products, modelId, selectedPerformance).length === 0
        ) ? (
          <p className="text-center text-base text-[#232326]/60">
            {selectedModelId
              ? 'Нет моделей с выбранной производительностью. Сбросьте фильтр производительности.'
              : 'Выберите модель, чтобы увидеть доступные варианты.'}
          </p>
        ) : null}
      </div>
    </article>
  )
}
