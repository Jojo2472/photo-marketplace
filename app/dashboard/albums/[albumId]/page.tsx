// app/albums/[albumId]/page.tsx
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import UploadModal from '@/components/UploadModal'

export default async function AlbumPage({
  params,
  searchParams,
}: {
  params: { albumId: string }
  searchParams: { upload?: string }
}) {
  const supabase = createClient(cookies)
  const { data: album, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', params.albumId)
    .single()

  if (error) {
    return <div>Album not found.</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{album.name}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Created: {new Date(album.created_at).toLocaleString()}
      </p>
      <p className="mb-8">
        {album.description || 'No description yet.'}
      </p>

      {searchParams.upload === '1' && (
        <UploadModal albumId={params.albumId} />
      )}
    </div>
  )
}
