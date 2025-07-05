'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

type Album = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
};

type AlbumWithThumbnail = Album & {
  thumbnail_url?: string;
};

export default function AlbumsPage() {
  const supabase = createClient();

  const [albums, setAlbums] = useState<AlbumWithThumbnail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: albumsData, error } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !albumsData) {
        setAlbums([]);
        setLoading(false);
        return;
      }

      // Fetch first photo for each album as a thumbnail
      const albumsWithThumbnails = await Promise.all(
        albumsData.map(async (album) => {
          const { data: photos } = await supabase
            .from('photos')
            .select('url')
            .eq('album_id', album.id)
            .order('created_at', { ascending: true })
            .limit(1);

          return {
            ...album,
            thumbnail_url: photos?.[0]?.url || null,
          };
        })
      );

      setAlbums(albumsWithThumbnails);
      setLoading(false);
    };

    fetchAlbums();
  }, [supabase]);

  if (loading) {
    return <p className="p-4">Loading albums...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Albums</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/dashboard/albums/${album.id}`}
            className="flex gap-4 p-4 border rounded hover:bg-gray-50 transition"
          >
            <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
              {album.thumbnail_url ? (
                <img
                  src={album.thumbnail_url}
                  alt="Album thumbnail"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{album.title}</h2>
              {album.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {album.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
