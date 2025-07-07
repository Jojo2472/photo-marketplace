import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { albumId: string } }) {
  const supabase = createClient();
  const userId = await getUserIdFromRequest(req);
  const albumId = params.albumId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', albumId)
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect('/dashboard/albums', 303);
}
