import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: albums, error } = await supabase
    .from('albums')
    .select('id, title, description, cover_image_url, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch albums:', error.message);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }

  return NextResponse.json({ albums });
}

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, cover_image_url } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const { error } = await supabase.from('albums').insert([
    {
      title,
      description,
      cover_image_url,
      seller_id: user.id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Failed to create album:', error.message);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
