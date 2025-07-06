import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const albumId = formData.get('albumId') as string;

  if (!file || !albumId) {
    return NextResponse.json({ error: 'Missing file or albumId' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${uuidv4()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads/originals');

  // Ensure the directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Save the file
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);

  // ✅ Create Supabase client with required arguments
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Insert photo data into Supabase
  const { data, error } = await supabase.from('photos').insert({
    album_id: albumId,
    original_url: `/uploads/originals/${filename}`,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}



