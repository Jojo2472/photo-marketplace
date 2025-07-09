//app/api/albums/[albumId]/photos/route.ts


import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(
  req: NextRequest,
  { params }: { params: { albumId: string } }
) {
  const supabase = createClient();
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const description = formData.get('description') as string;
  const albumId = params.albumId;

  if (!file || !file.name) {
    console.error('❌ No file found in form data');
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `photos/${randomUUID()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('❌ Supabase Upload Error:', uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: insertedPhoto, error: dbError } = await supabase
    .from('photos')
    .insert({
      album_id: albumId,
      original_url: uploadData?.path,
      description,
    })
    .select()
    .single();

  if (dbError) {
    console.error('❌ Supabase DB Insert Error:', dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(insertedPhoto);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { albumId: string } }
) {
  const supabase = createClient();
  const albumId = params.albumId;

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
