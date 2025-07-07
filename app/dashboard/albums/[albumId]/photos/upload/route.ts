import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: Request, { params }: { params: { albumId: string } }) {
  const supabase = createClient();
  const userId = await getUserIdFromRequest(req);
  const albumId = params.albumId;
  const formData = await req.formData();

  const file = formData.get('photo') as File | null;

  if (!userId || !file) {
    return NextResponse.json({ error: 'Unauthorized or missing file' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name);
  const filename = `${uuidv4()}${ext}`;
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'photos', filename);

  await fs.mkdir(path.dirname(uploadPath), { recursive: true });
  await fs.writeFile(uploadPath, buffer);

  const publicUrl = `/uploads/photos/${filename}`;

  const { data, error } = await supabase
    .from('photos')
    .insert({
      user_id: userId,
      album_id: albumId,
      url: publicUrl,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
