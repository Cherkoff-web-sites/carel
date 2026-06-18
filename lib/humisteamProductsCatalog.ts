import type { HumisteamModelId } from '@/lib/catalogData'

export type HumiSteamProductSpecs = {
  powerSupply: string
  control: string
  cylinderType: string
  dimensions?: string
  recommendedArea?: string
  powerKw?: string
  steamConnection?: string
  cylinderCount?: string
  weight?: string
  netWeight?: string
  grossWeight?: string
  packagingDimensions?: string
  protectionClass?: string
  features?: string
}

export type HumiSteamCatalogEntry = {
  sku: string
  modelId: HumisteamModelId
  performanceKgH: number
  lineName: 'Basic' | 'X-Plus' | 'Wellness'
  subtitle: string
  specs: HumiSteamProductSpecs
}

const DIM_SMALL = '712×365×275 мм'
const DIM_MEDIUM = '815×545×375 мм'
const DIM_LARGE = '890×635×465 мм'

const CTRL_BASIC = 'ВКЛ/ВЫКЛ или пропорциональное'
const CTRL_XPLUS = 'интеллектуальный контроллер pCO (серия X)'
const CTRL_WELLNESS = 'управление температурой для саун'

function basic(
  sku: string,
  performanceKgH: number,
  subtitle: string,
  specs: Partial<HumiSteamProductSpecs> & Pick<HumiSteamProductSpecs, 'powerSupply' | 'cylinderType'>
): HumiSteamCatalogEntry {
  return {
    sku,
    modelId: 'basic-uey',
    performanceKgH,
    lineName: 'Basic',
    subtitle,
    specs: {
      control: CTRL_BASIC,
      dimensions: DIM_SMALL,
      ...specs,
    },
  }
}

function xplus(
  sku: string,
  performanceKgH: number,
  subtitle: string,
  specs: Partial<HumiSteamProductSpecs> & Pick<HumiSteamProductSpecs, 'powerSupply' | 'cylinderType'>
): HumiSteamCatalogEntry {
  const dimensions =
    performanceKgH >= 65
      ? DIM_LARGE
      : performanceKgH >= 25
        ? DIM_MEDIUM
        : DIM_SMALL

  return {
    sku,
    modelId: 'xplus-uex',
    performanceKgH,
    lineName: 'X-Plus',
    subtitle,
    specs: {
      control: CTRL_XPLUS,
      protectionClass: 'IP20',
      dimensions,
      ...specs,
    },
  }
}

function wellness(
  sku: string,
  performanceKgH: number,
  subtitle: string,
  specs: Partial<HumiSteamProductSpecs> & Pick<HumiSteamProductSpecs, 'powerSupply' | 'cylinderType'>
): HumiSteamCatalogEntry {
  const dimensions =
    performanceKgH >= 65
      ? DIM_LARGE
      : performanceKgH >= 25
        ? DIM_MEDIUM
        : performanceKgH >= 15
          ? DIM_SMALL
          : undefined

  return {
    sku,
    modelId: 'wellness-uew',
    performanceKgH,
    lineName: 'Wellness',
    subtitle,
    specs: {
      control: CTRL_WELLNESS,
      protectionClass: 'IP20',
      features: 'Управление температурой для саун',
      dimensions,
      ...specs,
    },
  }
}

/** Каталог humiSteam по данным клиента */
export const HUMISTEAM_CATALOG_ENTRIES: HumiSteamCatalogEntry[] = [
  // —— Basic (UE*Y) ——
  basic('UE001YD001', 1.5, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Неразборный (одноразовый)',
    recommendedArea: 'до 45 м²',
  }),
  basic('UE001YDC01', 1.5, 'Паровой увлажнитель CAREL | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 45 м²',
  }),
  basic('UE003YD001', 3, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Неразборный (одноразовый)',
    recommendedArea: 'до 90 м²',
  }),
  basic('UE003YDC01', 3, 'Паровой увлажнитель CAREL | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 90 м²',
  }),
  basic('UE005YD001', 5, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Неразборный (одноразовый)',
    powerKw: '3,75 кВт',
    steamConnection: 'Ø 30 мм',
    cylinderCount: '1',
    weight: '17 кг',
    recommendedArea: 'до 150 м²',
  }),
  basic('UE005YDC01', 5, 'Паровой увлажнитель CAREL | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное (200–230В ±10–15%, 50/60 Гц)',
    cylinderType: 'Разборный (cleanable)',
    powerKw: '3,75 кВт',
    steamConnection: 'Ø 30 мм',
    cylinderCount: '1',
    weight: '17 кг',
    recommendedArea: 'до 150 м²',
  }),
  basic('UE005YL001', 5, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Неразборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Неразборный (одноразовый)',
    recommendedArea: 'до 150 м²',
  }),
  basic('UE009YD001', 9, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Неразборный (одноразовый)',
    recommendedArea: 'до 270 м²',
  }),
  basic('UE010YLC01', 10, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 300 м²',
  }),
  basic('UE015YLC01', 15, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 450 м²',
  }),
  basic('UE025YLC01', 25, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_MEDIUM,
    recommendedArea: 'до 750 м²',
  }),
  basic('UE035YLC01', 35, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_MEDIUM,
    recommendedArea: 'до 1050 м²',
  }),
  basic('UE045YLC01', 45, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_MEDIUM,
    recommendedArea: 'до 1350 м²',
  }),
  basic('UE065YLC01', 65, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_LARGE,
    recommendedArea: 'до 1950 м²',
  }),

  // —— X-Plus (UE*X) ——
  xplus('UE001XDC01', 1.5, 'Паровой увлажнитель CAREL | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное (1~, 220В)',
    cylinderType: 'Разборный (cleanable)',
    powerKw: '1,12 кВт',
    steamConnection: 'Ø 22/30 мм',
    cylinderCount: '1',
    netWeight: '13,5 кг',
    recommendedArea: 'до 45 м²',
  }),
  xplus('UE001XD0E1', 1.5, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр | Малошумный контактор', {
    powerSupply: '230В, однофазное (1~, 220В)',
    cylinderType: 'Неразборный (одноразовый)',
    powerKw: '1,12 кВт',
    steamConnection: 'Ø 22/30 мм',
    cylinderCount: '1',
    netWeight: '13,5 кг',
    features: 'Малошумный контактор',
    recommendedArea: 'до 45 м²',
  }),
  xplus('UE003XDC01', 3, 'Паровой увлажнитель CAREL | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Разборный (cleanable)',
    powerKw: '2,25 кВт',
    steamConnection: 'Ø 30 мм',
    cylinderCount: '1',
    recommendedArea: 'до 90 м²',
  }),
  xplus('UE003XD0E1', 3, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Неразборный (одноразовый)',
    powerKw: '2,25 кВт',
    steamConnection: 'Ø 30 мм',
    cylinderCount: '1',
    recommendedArea: 'до 90 м²',
  }),
  xplus('UE005XDC01', 5, 'Паровой увлажнитель CAREL | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное (1~, 220В)',
    cylinderType: 'Разборный (cleanable)',
    powerKw: '3,75 кВт',
    steamConnection: 'Ø 30 мм',
    cylinderCount: '1',
    packagingDimensions: '850×500×400 мм',
    netWeight: '13,5 кг',
    grossWeight: '16 кг',
    recommendedArea: 'до 150 м²',
  }),
  xplus('UE005XD0E1', 5, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Неразборный (одноразовый)',
    powerKw: '3,75 кВт',
    steamConnection: 'Ø 30 мм',
    cylinderCount: '1',
    recommendedArea: 'до 150 м²',
  }),
  xplus('UE009XD0E1', 9, 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Неразборный (одноразовый)',
    recommendedArea: 'до 270 м²',
  }),
  xplus('UE010XLC01', 10, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 300 м²',
  }),
  xplus('UE015XLC01', 15, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 450 м²',
  }),
  xplus('UE015XL0E1', 15, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Неразборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Неразборный (одноразовый)',
    recommendedArea: 'до 450 м²',
  }),
  xplus('UE025XLC01', 25, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 750 м²',
  }),
  xplus('UE035XLC01', 35, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 1050 м²',
  }),
  xplus('UE045XL0E1', 45, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Неразборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Неразборный (одноразовый)',
    recommendedArea: 'до 1350 м²',
  }),
  xplus('UE045XLC01', 45, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 1350 м²',
  }),
  xplus('UE065XLC01', 65, 'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    recommendedArea: 'до 1950 м²',
  }),
  xplus(
    'UE090XLC01',
    90,
    'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр | Двухцилиндровая конфигурация',
    {
      powerSupply: '3×400В, трёхфазное',
      cylinderType: 'Разборный (cleanable)',
      features: 'Двухцилиндровая конфигурация, регулирование от 10%',
      recommendedArea: 'до 2700 м²',
    }
  ),
  xplus(
    'UE130XLC01',
    130,
    'Паровой увлажнитель CAREL | 3×400В, трёхфазное | Разборный цилиндр | Двухцилиндровая конфигурация',
    {
      powerSupply: '3×400В, трёхфазное',
      cylinderType: 'Разборный (cleanable)',
      features: 'Двухцилиндровая конфигурация, регулирование от 10%',
      recommendedArea: 'до 3900 м²',
    }
  ),

  // —— Wellness (UE*W) ——
  wellness('UE001WDC01', 1.5, 'Паровой увлажнитель CAREL для саун | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Разборный (cleanable)',
  }),
  wellness('UE003WDC01', 3, 'Паровой увлажнитель CAREL для саун | 230В, однофазное | Разборный цилиндр', {
    powerSupply: '230В, однофазное',
    cylinderType: 'Разборный (cleanable)',
  }),
  wellness('UE005WD001', 5, 'Паровой увлажнитель CAREL для саун | 230В, однофазное | Неразборный цилиндр', {
    powerSupply: '230В, однофазное (1~, 220В)',
    cylinderType: 'Неразборный (одноразовый)',
    powerKw: '3,75 кВт',
    steamConnection: 'Ø 30 мм',
    cylinderCount: '1',
    dimensions: DIM_SMALL,
    packagingDimensions: '850×500×400 мм',
    netWeight: '13,5 кг',
    grossWeight: '16 кг',
  }),
  wellness('UE005WLC01', 5, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
  }),
  wellness('UE008WLC01', 8, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
  }),
  wellness('UE010WLC01', 10, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
  }),
  wellness('UE015WL001', 15, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Неразборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Неразборный (одноразовый)',
    dimensions: DIM_SMALL,
  }),
  wellness('UE015WLC01', 15, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_SMALL,
  }),
  wellness('UE025WL001', 25, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Неразборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Неразборный (одноразовый)',
    dimensions: DIM_MEDIUM,
  }),
  wellness('UE025WLC01', 25, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_MEDIUM,
  }),
  wellness('UE045WL001', 45, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Неразборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Неразборный (одноразовый)',
    dimensions: DIM_MEDIUM,
  }),
  wellness('UE045WLC01', 45, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_MEDIUM,
  }),
  wellness('UE065WLC01', 65, 'Паровой увлажнитель CAREL для саун | 3×400В, трёхфазное | Разборный цилиндр', {
    powerSupply: '3×400В, трёхфазное',
    cylinderType: 'Разборный (cleanable)',
    dimensions: DIM_LARGE,
  }),
]
