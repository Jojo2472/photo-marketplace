// /app/api/photos/uploads/route.ts

export const runtime = 'nodejs'; // Force Node.js runtime for this API route
export const dynamic = 'force-dynamic'; // Disable default body parser

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: Request): Promise<Response> {
  const form = new formidable.IncomingForm();

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(process.cwd(), 'public', 'uploads', 'watermarked');

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(watermarkedDir)) fs.mkdirSync(watermarkedDir, { recursive: true });

  return new Promise<Response>((resolve) => {
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
      }

      const file = files.file as formidable.File;
      if (!file) {
        return resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
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
        return resolve(NextResponse.json({ error: 'Watermarking failed' }, { status: 500 }));
      }

      const uploadedUrl = `/uploads/${filename}`;
      const watermarkedUrl = `/uploads/watermarked/${filename}`;

      return resolve(
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
