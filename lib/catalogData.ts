export type CatalogTreeNode = {
  id: string
  label: string
  children?: CatalogTreeNode[]
}

export const CATALOG_TREE: CatalogTreeNode[] = [
  {
    id: 'isothermal',
    label: 'Изотермические',
    children: [
      {
        id: 'humisteam',
        label: 'humiSteam',
        children: [
          { id: 'basic-uey', label: 'Basic (UE*Y)' },
          { id: 'xplus-uex', label: 'X-Plus (UE*X)' },
          { id: 'wellness-uew', label: 'Wellness (UE*W)' },
        ],
      },
      {
        id: 'heatersteam',
        label: 'heaterSteam',
        children: [
          { id: 'heatersteam-process', label: 'process' },
          { id: 'heatersteam-titanium', label: 'titanium' },
        ],
      },
      {
        id: 'compactsteam',
        label: 'compactSteam',
        children: [
          { id: 'compactsteam-duct', label: 'duct' },
          { id: 'compactsteam-room', label: 'room' },
        ],
      },
    ],
  },
  {
    id: 'adiabatic',
    label: 'Адиабатические',
    children: [
      { id: 'humisonic-compact', label: 'humiSonic compact' },
      { id: 'humisonic-ventilation', label: 'humiSonic ventilation' },
      { id: 'humisonic-direct', label: 'humiSonic direct' },
      { id: 'humidisk', label: 'humiDisk' },
      { id: 'humifog', label: 'humiFog' },
      { id: 'humifog-direct', label: 'humiFog direct' },
    ],
  },
  {
    id: 'evaporative-cooling',
    label: 'Испарительное охлаждение',
    children: [
      { id: 'chillbooster', label: 'chillBooster' },
      { id: 'optimist', label: 'optiMist' },
    ],
  },
  {
    id: 'water-treatment',
    label: 'Водоподготовка',
    children: [{ id: 'wts', label: 'WTS' }],
  },
]

export function findCatalogNodeById(
  nodes: CatalogTreeNode[],
  id: string
): CatalogTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.children) {
      const found = findCatalogNodeById(node.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

export const HUMISTEAM_CATALOG_IDS = [
  'humisteam',
  'basic-uey',
  'xplus-uex',
  'wellness-uew',
] as const

export type HumisteamCatalogId = (typeof HUMISTEAM_CATALOG_IDS)[number]

export const HUMISTEAM_MODEL_IDS = ['basic-uey', 'xplus-uex', 'wellness-uew'] as const

export type HumisteamModelId = (typeof HUMISTEAM_MODEL_IDS)[number]

export function isHumisteamCatalogId(id: string | null): id is HumisteamCatalogId {
  return id !== null && (HUMISTEAM_CATALOG_IDS as readonly string[]).includes(id)
}

export function catalogIdToModelId(id: string): HumisteamModelId | null {
  return (HUMISTEAM_MODEL_IDS as readonly string[]).includes(id)
    ? (id as HumisteamModelId)
    : null
}

export const HEATERSTEAM_CATALOG_IDS = [
  'heatersteam',
  'heatersteam-process',
  'heatersteam-titanium',
] as const

export type HeatersteamCatalogId = (typeof HEATERSTEAM_CATALOG_IDS)[number]

export const HEATERSTEAM_VARIANT_IDS = ['heatersteam-process', 'heatersteam-titanium'] as const

export type HeatersteamVariantId = (typeof HEATERSTEAM_VARIANT_IDS)[number]

export function isHeatersteamCatalogId(id: string | null): id is HeatersteamCatalogId {
  return id !== null && (HEATERSTEAM_CATALOG_IDS as readonly string[]).includes(id)
}

export function catalogIdToHeatersteamVariantId(id: string): HeatersteamVariantId | null {
  return (HEATERSTEAM_VARIANT_IDS as readonly string[]).includes(id)
    ? (id as HeatersteamVariantId)
    : null
}

/** ID узлов-родителей для авто-раскрытия аккордеона в сайдбаре */
export const CATALOG_CATEGORY_IDS = CATALOG_TREE.map((node) => node.id)

export type CatalogCategoryId = (typeof CATALOG_CATEGORY_IDS)[number]

export function isCatalogCategoryId(id: string | null): id is CatalogCategoryId {
  return id !== null && (CATALOG_CATEGORY_IDS as readonly string[]).includes(id)
}

export function getCatalogCategoryNodes(): CatalogTreeNode[] {
  return CATALOG_TREE
}

export function getCatalogCategoryById(id: string): CatalogTreeNode | undefined {
  return CATALOG_TREE.find((node) => node.id === id)
}

/** Серии с полноценной страницей каталога (остальные — заглушка до подключения) */
export const CATALOG_SERIES_WITH_PAGE = ['humisteam', 'heatersteam'] as const

export function isCatalogSeriesWithPage(id: string): boolean {
  return (CATALOG_SERIES_WITH_PAGE as readonly string[]).includes(id)
}

/** Все конечные разделы внутри узла (сам узел, если без детей) */
export function getCatalogLeafIds(nodes: CatalogTreeNode[], nodeId: string): string[] {
  const node = findCatalogNodeById(nodes, nodeId)
  if (!node) {
    return []
  }
  if (!node.children?.length) {
    return [node.id]
  }
  const leaves: string[] = []
  const collect = (children: CatalogTreeNode[]) => {
    for (const child of children) {
      if (!child.children?.length) {
        leaves.push(child.id)
      } else {
        collect(child.children)
      }
    }
  }
  collect(node.children)
  return leaves
}

export function getFirstCatalogLeafId(nodes: CatalogTreeNode[]): string | null {
  for (const node of nodes) {
    if (!node.children?.length) {
      return node.id
    }
    const nested = getFirstCatalogLeafId(node.children)
    if (nested) {
      return nested
    }
  }
  return null
}

export function getCatalogAncestorIds(
  nodes: CatalogTreeNode[],
  targetId: string,
  ancestors: string[] = []
): string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return ancestors
    }
    if (node.children) {
      const found = getCatalogAncestorIds(node.children, targetId, [...ancestors, node.id])
      if (found !== null) {
        return found
      }
    }
  }
  return null
}
