import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export async function GET(req: NextRequest, { params }: { params: { albumId: string } }) {
  const { albumId } = params;

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
