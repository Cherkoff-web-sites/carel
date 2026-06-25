import { NextRequest, NextResponse } from 'next/server'
import { readSharedTabs, writeSharedTabs, type SharedTabsData } from '@/lib/sharedTabsStore'

export const dynamic = 'force-dynamic'

export async function GET() {  const tabs = await readSharedTabs()
  return NextResponse.json(tabs)
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SharedTabsData>
    const current = await readSharedTabs()
    const next: SharedTabsData = {
      deliveryText: body.deliveryText ?? current.deliveryText,
      paymentText: body.paymentText ?? current.paymentText,
    }
    await writeSharedTabs(next)
    return NextResponse.json({ success: true, tabs: next })
  } catch {
    return NextResponse.json({ error: 'Failed to update shared tabs' }, { status: 500 })
  }
}
