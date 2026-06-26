import AdmZip from 'adm-zip'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { getUploadsRoot } from '@/lib/uploads'

const ALLOWED_ROOTS = ['images/', 'docs/']

function normalizeEntryName(name: string): string {
  return name.replace(/\\/g, '/').replace(/^uploads\//, '')
}

function isAllowedEntry(name: string): boolean {
  return ALLOWED_ROOTS.some((prefix) => name.startsWith(prefix))
}

export async function buildUploadsArchive(): Promise<Buffer> {
  const root = getUploadsRoot()
  await mkdir(path.join(root, 'images'), { recursive: true })
  await mkdir(path.join(root, 'docs'), { recursive: true })

  const zip = new AdmZip()
  zip.addLocalFolder(path.join(root, 'images'), 'images')
  zip.addLocalFolder(path.join(root, 'docs'), 'docs')
  return zip.toBuffer()
}

export async function restoreUploadsArchive(buffer: Buffer): Promise<number> {
  const root = getUploadsRoot()
  await mkdir(root, { recursive: true })

  const zip = new AdmZip(buffer)
  let restored = 0

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue

    const entryName = normalizeEntryName(entry.entryName)
    if (!isAllowedEntry(entryName) || entryName.includes('../')) {
      continue
    }

    const target = path.resolve(root, entryName)
    const rootResolved = path.resolve(root)
    if (!target.startsWith(rootResolved + path.sep)) {
      continue
    }

    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, entry.getData())
    restored += 1
  }

  return restored
}

export function buildUploadsArchiveFilename(): string {
  const stamp = new Date().toISOString().slice(0, 10)
  return `carel-uploads_${stamp}.zip`
}
