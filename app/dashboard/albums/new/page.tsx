//app/dashboard/albums/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NewAlbumPage() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // TODO: Fetch albums here if needed
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

      {/* Album list - placeholder for now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {albums.length === 0 ? (
          <p className="text-gray-500">You haven't created any albums yet.</p>
        ) : (
          albums.map((album) => (
            <div
              key={album.id}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{album.title}</h3>
              <p className="text-sm text-gray-600">{album.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
