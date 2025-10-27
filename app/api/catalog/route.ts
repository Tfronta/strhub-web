import { NextResponse } from 'next/server'
import { CATALOG } from '@/app/catalog/data'  // ajusta si tu data está en otro path

export const dynamic = 'force-dynamic'; // evita caché

export async function GET() {
  // Devolver lista de IDs
  const markers = Object.keys(CATALOG)
  return NextResponse.json({ markers })
}
