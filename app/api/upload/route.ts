// 1. /app/api/upload/route.ts (server-side handler for local photo uploads)
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file: File | null = formData.get('file') as unknown as File
  const albumId = formData.get('albumId') as string

  if (!file || !albumId) {
    return NextResponse.json({ error: 'Missing file or albumId' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = uuidv4() + path.extname(file.name)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', albumId)
  const filePath = path.join(uploadDir, filename)

  // Ensure folder exists
  await fs.mkdir(uploadDir, { recursive: true })

  await writeFile(filePath, buffer)

  const url = `/uploads/${albumId}/${filename}`
  return NextResponse.json({ url })
}




