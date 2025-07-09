// /app/api/photos/uploads/route.ts

// /app/api/photos/uploads/route.ts

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<NextResponse> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const blurredDir = path.join(uploadDir, 'blurred');
  const watermarkedDir = path.join(uploadDir, 'watermarked');

  // Create dirs if they don't exist
  [uploadDir, blurredDir, watermarkedDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  return new Promise<NextResponse>((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
        return;
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
        return;
      }

      const inputFilePath = file.filepath;
      const filename = path.basename(inputFilePath);

      const blurredPath = path.join(blurredDir, filename);
      const watermarkedPath = path.join(watermarkedDir, filename);

      try {
        // Generate blurred version
        await sharp(inputFilePath)
          .resize(200) // smaller size for blur preview
          .blur(10)
          .toFile(blurredPath);

        // Generate watermarked version
        await sharp(inputFilePath)
          .composite([
            {
              input: Buffer.from(
                `<svg width="200" height="200">
                  <text x="10" y="180" font-size="30" fill="white" stroke="black" stroke-width="1" opacity="0.5">Watermark</text>
                </svg>`
              ),
              gravity: 'southeast',
            },
          ])
          .toFile(watermarkedPath);
      } catch (e) {
        resolve(NextResponse.json({ error: 'Image processing failed' }, { status: 500 }));
        return;
      }

      resolve(
        NextResponse.json({
          success: true,
          originalUrl: `/uploads/${filename}`,
          blurredUrl: `/uploads/blurred/${filename}`,
          watermarkedUrl: `/uploads/watermarked/${filename}`,
          fields,
        })
      );
    });
  });
}
