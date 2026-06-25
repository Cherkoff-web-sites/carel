import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { sharedSettings } from '@/lib/db/schema'
import { getDefaultSharedTabs, SHARED_TABS_KEY, type SharedTabsData } from '@/lib/sharedTabsDefaults'

export type { SharedTabsData } from '@/lib/sharedTabsDefaults'

export async function readSharedTabs(): Promise<SharedTabsData> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(sharedSettings)
    .where(eq(sharedSettings.key, SHARED_TABS_KEY))
    .limit(1)

  const row = rows[0]
  if (!row) {
    return getDefaultSharedTabs()
  }

  try {
    return JSON.parse(row.valueJson) as SharedTabsData
  } catch {
    return getDefaultSharedTabs()
  }
}

export async function writeSharedTabs(data: SharedTabsData): Promise<SharedTabsData> {
  const db = await getDb()
  const valueJson = JSON.stringify(data)

  await db
    .insert(sharedSettings)
    .values({
      key: SHARED_TABS_KEY,
      valueJson,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: sharedSettings.key,
      set: {
        valueJson,
        updatedAt: new Date(),
      },
    })

  return data
}
