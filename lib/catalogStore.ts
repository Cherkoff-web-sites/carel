import { readFile, writeFile, mkdir, copyFile, access } from 'fs/promises'
import { join } from 'path'
import { buildCatalogSeed } from '@/lib/catalogSeed'
import type {
  CatalogFile,
  CatalogKey,
  ComponentsPatch,
  HeatersteamPatch,
  HumisteamPatch,
} from '@/lib/catalogTypes'

const DATA_DIR = join(process.cwd(), 'data')
const CATALOG_FILE = join(DATA_DIR, 'catalog.json')
const CATALOG_DEFAULT_FILE = join(process.cwd(), 'data-default', 'catalog.json')

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
}

async function writeCatalog(catalog: CatalogFile): Promise<void> {
  await ensureDataDir()
  await writeFile(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf-8')
}

export async function readCatalog(): Promise<CatalogFile> {
  await ensureDataDir()

  if (await fileExists(CATALOG_FILE)) {
    const raw = await readFile(CATALOG_FILE, 'utf-8')
    return JSON.parse(raw) as CatalogFile
  }

  if (await fileExists(CATALOG_DEFAULT_FILE)) {
    await copyFile(CATALOG_DEFAULT_FILE, CATALOG_FILE)
    const raw = await readFile(CATALOG_FILE, 'utf-8')
    return JSON.parse(raw) as CatalogFile
  }

  const seed = buildCatalogSeed()
  await writeCatalog(seed)
  return seed
}

export async function getCatalogProducts<K extends CatalogKey>(
  catalog: K
): Promise<CatalogFile[K]> {
  const data = await readCatalog()
  return data[catalog]
}

type CatalogPatch = HumisteamPatch | HeatersteamPatch | ComponentsPatch

export async function updateCatalogProduct(
  catalog: CatalogKey,
  id: string,
  patch: CatalogPatch
): Promise<CatalogFile[CatalogKey][number] | null> {
  const data = await readCatalog()
  const products = data[catalog] as Array<{ id: string } & CatalogPatch>
  const index = products.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  products[index] = { ...products[index], ...patch }
  await writeCatalog(data)
  return products[index] as CatalogFile[CatalogKey][number]
}
