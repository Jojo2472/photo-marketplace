// app/dashboard/albums/[albumId]/upload/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function UploadPage({ params }: { params: { albumId: string } }) {
  const router = useRouter();
  const supabase = createClient();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`${params.albumId}/${file.name}`, file);

    setUploading(false);

    if (error) {
      console.error('Upload error:', error.message);
      return;
    }

    router.push('/dashboard/albums');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload to Album</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
