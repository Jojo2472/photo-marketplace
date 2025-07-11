// app/api/albums/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (!session || sessionError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const file = formData.get('cover') as File | null

    let coverUrl: string | null = null

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${randomUUID()}-${file.name}`

      const { data, error: uploadError } = await supabase.storage
        .from('album-covers')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json({ error: uploadError.message || JSON.stringify(uploadError) || 'Unknown upload error' }, { status: 500 })
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('album-covers').getPublicUrl(fileName)

      coverUrl = publicUrl
    }

    const { error: insertError } = await supabase.from('albums').insert({
      name,
      description,
      cover_url: coverUrl,
      user_id: session.user.id,
    })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    const { data: albums, error: fetchError } = await supabase
      .from('albums')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json(albums)
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
