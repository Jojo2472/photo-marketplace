import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const albumId = formData.get('albumId') as string;

  if (!file || !albumId) {
    return NextResponse.json({ error: 'Missing file or albumId' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = Date.now() + '-' + file.name;

  const originalPath = path.join(process.cwd(), 'public/uploads/originals', filename);
  const blurredPath = path.join(process.cwd(), 'public/uploads/blurred', filename);

  await mkdir(path.dirname(originalPath), { recursive: true });
  await mkdir(path.dirname(blurredPath), { recursive: true });

  // Save original photo
  fs.writeFileSync(originalPath, buffer);

  // Add blur + watermark
  const watermarkSvg = Buffer.from(
    `<svg width="500" height="60"><text x="0" y="45" font-size="45" fill="white">No Refunds</text></svg>`
  );

  await sharp(buffer)
    .resize(1000)
    .blur(20)
    .composite([{ input: watermarkSvg, gravity: 'south' }])
    .toFile(blurredPath);

  // Save photo data to Supabase
  const supabase = createClient();
  const { data, error } = await supabase.from('photos').insert({
    album_id: albumId,
    original_url: `/uploads/originals/${filename}`,
    blurred_url: `/uploads/blurred/${filename}`
  });

  if (error) {
    console.error('Error inserting photo record:', error);
    return NextResponse.json({ error: 'Upload saved but DB insert failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, photo: data?.[0] });
}


