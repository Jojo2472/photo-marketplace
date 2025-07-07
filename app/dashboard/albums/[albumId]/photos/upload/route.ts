import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { v4 as uuid } from 'uuid'

export async function POST(req: NextRequest, { params }: { params: { albumId: string } }) {
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

  const { albumId } = params

  const formData = await req.formData()
  const file = formData.get('photo') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const filename = `${uuid()}-${file.name}`
  const upload = await supabase.storage.from('photos').upload(filename, file, {
    contentType: file.type,
    upsert: true,
  })

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 })
  }

  const publicURL = supabase.storage.from('photos').getPublicUrl(filename).data.publicUrl

  const { data, error } = await supabase
    .from('photos')
    .insert([
      {
        album_id: albumId,
        original_url: publicURL,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

