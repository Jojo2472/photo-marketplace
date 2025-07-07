import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { albumId: string } }) {
  const supabase = createClient();
  const userId = await getUserIdFromRequest();
  const albumId = params.albumId;

  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', albumId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Album not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
