// /app/api/photos/uploads/route.ts

export const runtime = 'nodejs'; // Use Node.js runtime
export const dynamic = 'force-dynamic'; // Disable built-in body parsing

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: Request) {
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

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        resolve(
          NextResponse.json({ error: 'Upload failed' }, { status: 500 })
        );
        return;
      }

      // Handle single file or array of files
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file) {
        resolve(
          NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        );
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
      } catch {
        resolve(
          NextResponse.json({ error: 'Watermarking failed' }, { status: 500 })
        );
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
