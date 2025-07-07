// app/albums/[albumId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Photo {
  id: string;
  original_url: string;
  created_at: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  cover_url: string | null;
}

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlbum = async () => {
      const res = await fetch(`/api/albums/${albumId}`);
      const data = await res.json();
      if (res.ok) setAlbum(data);
    };

    const fetchPhotos = async () => {
      const res = await fetch(`/api/albums/${albumId}/photos`);
      const data = await res.json();
      if (res.ok) setPhotos(data);
    };

    fetchAlbum();
    fetchPhotos();
  }, [albumId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch(`/api/albums/${albumId}/photos/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const newPhoto = await res.json();
      setPhotos((prev) => [newPhoto, ...prev]);
      setFile(null);
    } else {
      alert('Failed to upload photo.');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {album && (
        <>
          <h1 className="text-2xl font-bold">{album.name}</h1>
          <p className="text-gray-600">{album.description}</p>

          {album.cover_url && (
            <div className="relative h-48 w-full sm:w-96">
              <Image
                src={album.cover_url}
                alt="Album cover"
                fill
                className="object-cover rounded"
              />
            </div>
          )}
        </>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-6">
        {photos.map((photo) => (
          <div key={photo.id} className="relative w-full aspect-square">
            <Image src={photo.original_url} alt="photo" fill className="object-cover rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
