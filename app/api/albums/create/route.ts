import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { createClient } from '@/utils/supabase/server'; // adjust path if needed
import { getUserIdFromRequest } from '@/lib/auth'; // assumes you extract user from JWT/cookies

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim() || '';
  const file = formData.get('cover') as File | null;

  if (!name) {
    return NextResponse.json({ error: 'Missing album name' }, { status: 400 });
  }

  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let coverUrl: string | null = null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'covers', filename);

    await fs.mkdir(path.dirname(uploadPath), { recursive: true });
    await fs.writeFile(uploadPath, buffer);

    coverUrl = `/uploads/covers/${filename}`;
  }

  const { data, error } = await supabase
    .from('albums')
    .insert({
      user_id: userId,
      name,
      description,
      cover_url: coverUrl,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ albumId: data.id });
}
