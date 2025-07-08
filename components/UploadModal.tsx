//components/UploadModal.tsx

'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createComponentClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function UploadModal({ albumId }: { albumId: string }) {
  const supabase = createComponentClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('You must be logged in to upload.');
      setUploading(false);
      return;
    }

    if (!file) {
      setError('Please select a file.');
      setUploading(false);
      return;
    }

    const filePath = `photos/${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) {
      setError('Failed to upload image: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase
      .storage
      .from('photos')
      .getPublicUrl(filePath);

    const imageUrl = urlData?.publicUrl ?? null;

    const { error: insertError } = await supabase
      .from('photos')
      .insert({
        album_id: albumId,
        user_id: user.id,
        image_url: imageUrl,
        description,
      });

    if (insertError) {
      setError('Failed to save photo metadata: ' + insertError.message);
      setUploading(false);
      return;
    }

    setOpen(false);
    setFile(null);
    setDescription('');
    router.refresh(); // Refresh the album page to show new photo
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Upload Photo
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full space-y-4">
        <h2 className="text-lg font-semibold">Upload Photo to Album</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <textarea
          placeholder="Optional description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </DialogContent>
    </Dialog>
  );
}
