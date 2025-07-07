'use client';

import { useRef, useState } from 'react';
import { Album } from '@/app/dashboard/page';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
  onAlbumCreated: (albums: Album[]) => void;
};

export default function AlbumModal({ open, onClose, onAlbumCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (coverFile) formData.append('cover', coverFile);

    const res = await fetch('/api/albums', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const albums = await res.json();
      onAlbumCreated(albums); // refresh album list
      setName('');
      setDescription('');
      setCoverFile(null);
      onClose();
    } else {
      alert('Failed to create album');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Create New Album</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Cover Image</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setCoverFile(e.target.files[0]);
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {loading ? 'Creating...' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

