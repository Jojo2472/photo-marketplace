// app/dashboard/albums/[albumId]/photos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { albumId: string } }
) {
  const supabase = createClient();

  const { albumId } = params;

  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', albumId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

