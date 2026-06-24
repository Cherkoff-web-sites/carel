import { join } from 'path'

export const DATA_DIR = join(process.cwd(), 'data')

export const CATALOG_JSON_FILE = join(DATA_DIR, 'catalog.json')

export const CATALOG_DEFAULT_JSON_FILE = join(process.cwd(), 'data-default', 'catalog.json')
