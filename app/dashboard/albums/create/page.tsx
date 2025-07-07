'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateAlbumPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (cover) formData.append('cover', cover);

    const res = await fetch('/api/albums/create', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/dashboard/albums/${data.albumId}`);
    } else {
      alert(data.error || 'Failed to create album.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Create New Album</h1>

      <input
        type="text"
        placeholder="Album name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files?.[0] || null)}
        className="w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        {loading ? 'Creating...' : 'Create Album'}
      </button>
    </form>
  );
}
