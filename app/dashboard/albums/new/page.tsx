'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get('/api/albums');
        setAlbums(res.data.albums || []);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load albums.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Albums</h2>
        <Link href="/dashboard/albums/new" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + New Album
        </Link>
      </div>

      {loading && <p>Loading albums...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {albums.map((album) => (
          <Link href={`/dashboard/albums/${album.id}`} key={album.id}>
            <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
            {album.cover_image_url ? (
              <img src={album.cover_image_url} alt={album.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No cover image
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{album.title}</h3>
              {album.description && (
                <p className="text-sm text-gray-600 mt-1">{album.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Created: {new Date(album.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

