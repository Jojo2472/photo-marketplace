//app/dashboard/albums/[albumId]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

type Album = Database['public']['Tables']['albums']['Row'];

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const loadAlbum = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId as string)
        .single();

      if (error) {
        console.error('Error loading album:', error.message);
      } else {
        setAlbum(data);
      }
    };

    loadAlbum();
  }, [albumId, supabase, router]);

  if (!album) {
    return <p className="p-6">Loading album...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{album.title}</h1>
      <p className="text-gray-600 mt-2">{album.description}</p>
      {/* You can expand this to show uploaded photos later */}
    </div>
  );
}
