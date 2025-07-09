// /app/api/photos/uploads/route.ts

// /app/api/photos/uploads/route.ts

import { NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<NextResponse> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(uploadDir, 'watermarked');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(watermarkedDir)) {
    fs.mkdirSync(watermarkedDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  return new Promise<NextResponse>((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
        return;
      }

      // files.file can be array or single File, normalize it
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file) {
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
        return;
      }

      const inputFilePath = (file as File).filepath;
      const filename = path.basename(inputFilePath);
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
      } catch (error) {
        console.error('Watermarking error:', error);
        resolve(NextResponse.json({ error: 'Watermarking failed' }, { status: 500 }));
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
