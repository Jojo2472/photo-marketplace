//components/UploadModal.tsx

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function UploadModal({ albumId }: { albumId: string }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);

    if (!file) {
      setError('Please select a file.');
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      const res = await fetch('/api/photos/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      setOpen(false);
      setFile(null);
      setDescription('');
      router.refresh(); // Refresh the page to show new photo
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
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
            if (e.target.files?.[0]) setFile(e.target.files[0]);
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
