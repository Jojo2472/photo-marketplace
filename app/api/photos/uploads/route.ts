// /app/api/photos/uploads/route.ts

export const runtime = 'nodejs'; // Use Node.js runtime for this API route
export const dynamic = 'force-dynamic'; // Disable Next.js built-in body parser for this route

import { NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import { formidableUpload } from 'formidable-upload';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: Request) {
  // Use formidableUpload helper to properly adapt Next.js Request to IncomingMessage
  const form = formidableUpload(new formidable.IncomingForm());

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(process.cwd(), 'public', 'uploads', 'watermarked');

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(watermarkedDir)) fs.mkdirSync(watermarkedDir, { recursive: true });

  return new Promise<NextResponse>(async (resolve) => {
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
      } catch {
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
