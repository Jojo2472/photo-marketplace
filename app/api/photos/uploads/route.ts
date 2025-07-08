// /app/api/photos/upload/route.ts

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Disable Next.js default body parser for formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  
  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = new formidable.IncomingForm();

  // Upload folders inside /public for serving later
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(process.cwd(), 'public', 'uploads', 'watermarked');

  // Ensure directories exist
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(watermarkedDir)) fs.mkdirSync(watermarkedDir, { recursive: true });

  return new Promise((resolve) => {
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
        return;
      }

      // Get uploaded file
      const file = files.file as formidable.File;
      if (!file) {
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
        return;
      }

      const inputFilePath = file.filepath;
      const filename = path.basename(inputFilePath);

      // Watermark the image (example: simple text watermark)
      const outputFilePath = path.join(watermarkedDir, filename);

      try {
        await sharp(inputFilePath)
          .composite([
            {
              input: Buffer.from(
                `<svg>
                  <text x="10" y="50" font-size="30" fill="white" stroke="black" stroke-width="1" opacity="0.5">Watermark</text>
                </svg>`
              ),
              gravity: 'southeast',
            },
          ])
          .toFile(outputFilePath);
      } catch (watermarkError) {
        resolve(NextResponse.json({ error: 'Watermarking failed' }, { status: 500 }));
        return;
      }

      // Save metadata to Supabase DB
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          album_id: fields.albumId,
          user_id: user.id,
          original_url: `/uploads/${filename}`,
          watermarked_url: `/uploads/watermarked/${filename}`,
          description: fields.description || '',
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        resolve(NextResponse.json({ error: 'Failed to save photo metadata' }, { status: 500 }));
        return;
      }

      resolve(
        NextResponse.json({
          success: true,
          uploadedUrl: `/uploads/${filename}`,
          watermarkedUrl: `/uploads/watermarked/${filename}`,
          fields,
        })
      );
    });
  });
}
