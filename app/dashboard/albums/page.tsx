import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getUserIdFromRequest } from '@/lib/auth';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AlbumListPage({ searchParams }: { searchParams: any }) {
  const supabase = createClient();
  const userId = await getUserIdFromRequest(); // adjust this if your helper is different

  const { data: albums, error } = await supabase
    .from('albums')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 text-red-600">Failed to load albums.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
            <Link href={`/dashboard/albums/${album.id}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={album.cover_url || '/placeholder.jpg'}
                  alt={album.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <div className="p-4">
              <h2 className="text-lg font-semibold">{album.name}</h2>
              <p className="text-sm text-gray-600">{album.description || 'No description'}</p>

              <div className="flex justify-between mt-4">
                <Link href={`/dashboard/albums/${album.id}/edit`} className="text-purple-600">
                  ✏️ Edit
                </Link>
                <form
                  action={`/api/albums/${album.id}/delete`}
                  method="POST"
                  onSubmit={(e) => {
                    if (!confirm('Delete this album?')) e.preventDefault();
                  }}
                >
                  <button type="submit" className="text-red-600">
                    🗑️ Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
