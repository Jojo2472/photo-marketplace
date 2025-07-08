// /app/api/photos/uploads/route.ts

export const runtime = 'nodejs'; // Force Node.js runtime for this API route

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Next.js 14 no longer uses 'config' for bodyParser disabling
// Use this instead:
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const form = new formidable.IncomingForm();

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(process.cwd(), 'public', 'uploads', 'watermarked');

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

      const file = files.file as formidable.File;
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
