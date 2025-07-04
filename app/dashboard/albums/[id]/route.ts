import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const albumId = params.id;

  // Fetch album
  const { data: album, error: albumError } = await supabase
    .from('albums')
    .select('id, title, description, cover_image_url, created_at')
    .eq('id', albumId)
    .eq('seller_id', user.id)
    .single();

  if (albumError || !album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  // Fetch photos in that album
  const { data: photos, error: photoError } = await supabase
    .from('photos')
    .select('id, title, price, preview_url')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });

  if (photoError) {
    console.error('Photo fetch error:', photoError.message);
    return NextResponse.json({ error: 'Failed to load photos' }, { status: 500 });
  }

  return NextResponse.json({ album, photos });
}
