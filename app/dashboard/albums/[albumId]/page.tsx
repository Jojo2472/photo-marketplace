// app/dashboard/albums/[albumId]/page.tsx

import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AlbumDetailPage({ params }: { params: { albumId: string } }) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: album, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', params.albumId)
    .single();

  if (error || !album) {
    return <div className="p-6 text-red-500">Album not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{album.name}</h1>
      <p className="text-gray-600 mt-2">{album.description}</p>
    </div>
  );
}

