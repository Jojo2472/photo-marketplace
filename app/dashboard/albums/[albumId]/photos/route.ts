import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { albumId: string } }) {
  const supabase = createClient();
  const userId = await getUserIdFromRequest();
  const albumId = params.albumId;

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
