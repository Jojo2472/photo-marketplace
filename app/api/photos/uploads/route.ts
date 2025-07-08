// /app/api/photos/uploads/route.ts

export const runtime = 'nodejs'; // Node runtime for this API route
export const dynamic = 'force-dynamic'; // Disable static optimizations

import { NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: Request) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(uploadDir, 'watermarked');

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(watermarkedDir)) fs.mkdirSync(watermarkedDir, { recursive: true });

  // Create IncomingForm instance with uploadDir option
  const form = new formidable.IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true,
  });

  return new Promise<NextResponse>((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
        return;
      }

      const file = files.file as File;
      if (!file) {
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
        return;
      }

      const inputFilePath = file.filepath;
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
      } catch (watermarkError) {
        resolve(NextResponse.json({ error: 'Watermarking failed' }, { status: 500 }));
        return;
      }

      const uploadedUrl = `/uploads/${filename}`;
      const watermarkedUrl = `/uploads/watermarked/${filename}`;

      resolve(
        NextResponse.json({
          success: true,
          uploadedUrl,
          watermarkedUrl,
          fields,
        })
      );
    });
  });
}
