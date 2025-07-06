// app/dashboard/page.tsx

export const dynamic = "force-dynamic";


import Link from 'next/link'
import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CreateAlbumButton from './CreateAlbumButton'

export default async function DashboardPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/login')
  }

  const { data: albums, error } = await supabase
    .from('albums')
    .select('*')
    .eq('user_id', session.user.id)

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Albums</h1>
        <CreateAlbumButton />
      </div>

      {albums?.length ? (
        <ul className="space-y-4">
          {albums.map((album) => (
            <li key={album.id}>
              <Link
                href={`/dashboard/albums/${album.id}`}
                className="block p-4 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                <div className="font-semibold">{album.name}</div>
                <div className="text-sm text-gray-600">{album.description}</div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No albums yet. Create one to get started!</p>
      )}
    </div>
  )
}
