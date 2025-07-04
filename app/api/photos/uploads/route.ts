// /app/api/photos/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get data from request body
  const body = await req.json();
  const {
    title,
    description,
    tags,
    price,
    albumId,
    originalUrl,
    previewUrl,
  } = body;

  // Save photo in Supabase table
  const { error } = await supabase.from('photos').insert([
    {
      title,
      description,
      tags,
      price,
      album_id: albumId,
      seller_id: user.id,
      original_url: originalUrl,
      preview_url: previewUrl,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Upload error:', error.message);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
