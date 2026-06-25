import { NextRequest, NextResponse } from 'next/server'
import { saveUploadedFile } from '@/lib/uploads'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const kind = formData.get('kind')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (kind !== 'image' && kind !== 'pdf') {
      return NextResponse.json({ error: 'kind must be image or pdf' }, { status: 400 })
    }

    const saved = await saveUploadedFile(file, kind)
    return NextResponse.json({ success: true, ...saved })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
