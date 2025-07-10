// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import Link from 'next/link';
import AlbumModal from '@/components/AlbumModal';

export type Album = {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
};

export default function DashboardPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // to trigger refetch
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchAlbums() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading albums:', error.message);
      } else {
        setAlbums(data as Album[]);
      }

      setLoading(false);
    }

    fetchAlbums();
  }, [refresh]);

  const handleAlbumCreated = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Albums</h1>
        <AlbumModal onAlbumCreated={handleAlbumCreated} />
      </div>

      {loading ? (
        <p>Loading albums...</p>
      ) : albums.length === 0 ? (
        <p className="text-gray-500">You haven’t created any albums yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/dashboard/albums/${album.id}`}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={
                  album.cover_url ||
                  'https://jllzzkqlqaoiotluyexb.supabase.co/storage/v1/object/public/album-covers/placeholder-cover.jpg'
                }
                alt={album.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{album.name}</h2>
                {album.description && (
                  <p className="text-sm text-gray-600 mt-1">{album.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
