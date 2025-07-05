//app/dashboard/albums/[albumId]/upload/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function UploadPage() {
  const [albumExists, setAlbumExists] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { albumId } = useParams();

  useEffect(() => {
    const checkAlbum = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('albums')
        .select('id')
        .eq('id', albumId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        router.push('/dashboard');
      } else {
        setAlbumExists(true);
      }
    };

    checkAlbum();
  }, [albumId, router]);

  const handleUpload = async () => {
    if (!file) return alert('Please choose a file.');

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      const { filename } = result;

      await supabase.from('photos').insert({
        album_id: albumId,
        original_url: `/uploads/original/${filename}`,
        blurred_url: `/uploads/blurred/${filename}`,
      });

      alert('Upload successful!');
      router.push('/dashboard');
    } else {
      alert('Upload failed: ' + result.error);
    }

    setUploading(false);
  };

  if (!albumExists) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Upload a Photo</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
