// /app/api/photos/uploads/route.ts

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Disable Next.js built-in body parser for this route
export const runtime = 'edge'; // Optional, depending on your environment

export const dynamic = 'force-dynamic'; // to allow request body parsing

export async function POST(request: Request) {
  const form = new formidable.IncomingForm();

  // Upload folders inside /public for serving later
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(uploadDir, 'watermarked');

  // Make sure directories exist
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(watermarkedDir)) fs.mkdirSync(watermarkedDir, { recursive: true });

  return new Promise((resolve) => {
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(request, async (err, fields, files) => {
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
      } catch {
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
