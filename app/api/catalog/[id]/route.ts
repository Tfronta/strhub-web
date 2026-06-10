import { NextResponse } from 'next/server'
import { CATALOG } from '@/app/catalog/data'

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const marker = CATALOG[id]

  if (!marker) {
    return NextResponse.json({ error: 'Marker not found' }, { status: 404 })
  }

  return NextResponse.json(marker)
}
