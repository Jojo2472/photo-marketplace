import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: Request, { params }: { params: { albumId: string } }) {
  const supabase = createClient();
  const userId = await getUserIdFromRequest();
  const albumId = params.albumId;
  const formData = await req.formData();

  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim() || '';
  const file = formData.get('cover') as File | null;

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!name) return NextResponse.json({ error: 'Missing album name' }, { status: 400 });

  let coverUrl: string | undefined = undefined;

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

  const updateData: Record<string, any> = { name, description };
  if (coverUrl) updateData.cover_url = coverUrl;

  const { error } = await supabase
    .from('albums')
    .update(updateData)
    .eq('id', albumId)
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
