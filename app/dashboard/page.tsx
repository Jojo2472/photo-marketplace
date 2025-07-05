// app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

type Album = Database['public']['Tables']['albums']['Row'];

export default function DashboardPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAlbums(data);
      }
    };

    fetchAlbums();
  }, []);

  const handleDeleteAlbum = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this album?');
    if (!confirmed) return;

    const res = await fetch(`/api/albums/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setAlbums((prev) => prev.filter((album) => album.id !== id));
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to delete album.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">{album.title}</h2>
            <p className="text-sm text-gray-500">{album.description}</p>
            <div className="mt-4 flex justify-between">
              <Link
                href={`/dashboard/albums/${album.id}`}
                className="text-purple-600 font-medium hover:underline"
              >
                View
              </Link>
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="text-red-500 font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
