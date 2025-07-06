// app/albums/[albumId]/page.tsx
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'

export default async function AlbumPage({
  params,
}: {
  params: { albumId: string }
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  const { data: album, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', params.albumId)
    .single()

  if (!album || error) {
    return notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{album.name}</h1>
      <p className="text-gray-600 mb-4">Created: {new Date(album.created_at).toLocaleString()}</p>
      <p className="text-gray-800">{album.description || 'No description yet.'}</p>
    </div>
  )
}


