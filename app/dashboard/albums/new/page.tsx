//app/dashboard/albums/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// ✅ Define the album type explicitly
type Album = {
  id: string;
  title: string;
};

export default function NewAlbumPage() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('/api/albums');
        const data = await res.json();
        setAlbums(data as Album[]);
      } catch (err) {
        console.error('Failed to fetch albums:', err);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Albums</h2>
        <Link
          href="/dashboard/albums/new"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Create New Album
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="border p-4 rounded shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">{album.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
