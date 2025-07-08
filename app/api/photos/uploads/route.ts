// /app/api/photos/upload/route.ts

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Set runtime for Node.js
export const runtime = 'nodejs';

// For Next.js 14: disable default body parsing by setting this to 0
export const requestBodyLimit = {
  sizeLimit: 0,
};

export async function POST(req: Request) {
  const form = new formidable.IncomingForm();

  // Upload folders inside /public for serving later
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const watermarkedDir = path.join(process.cwd(), 'public', 'uploads', 'watermarked');

  // Make sure directories exist
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

      // Watermark the image (example: add text watermark)
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

      // Return URLs to uploaded and watermarked images:
      const uploadedUrl = `/uploads/${filename}`;
      const watermarkedUrl = `/uploads/watermarked/${filename}`;

      resolve(
        NextResponse.json({
          success: true,
          uploadedUrl,
          watermarkedUrl,
          fields, // form fields like title, description
        })
      );
    });
  });
}
