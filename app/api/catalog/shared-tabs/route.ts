import { NextResponse } from 'next/server'
import { readSharedTabs } from '@/lib/sharedTabsStore'

export const dynamic = 'force-dynamic'

export async function GET() {  const tabs = await readSharedTabs()
  return NextResponse.json(tabs, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
