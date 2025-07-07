// app/api/albums/route.ts

import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // Validate session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const file = formData.get('cover') as File | null;

  let coverUrl: string | null = null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${randomUUID()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'covers', fileName);

    await writeFile(filePath, buffer);
    coverUrl = `/uploads/covers/${fileName}`;
  }

  // Insert album into Supabase
  const { error: insertError } = await supabase.from('albums').insert({
    name,
    description,
    cover_url: coverUrl,
    user_id: session.user.id,
  });

  if (insertError) {
    console.error(insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Return updated album list
  const { data: albums, error: fetchError } = await supabase
    .from('albums')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json(albums);
}
