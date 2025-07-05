// app/dashboard/page.tsx

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import CreateAlbumButton from './CreateAlbumButton'

type Album = {
  id: string
  name: string
  user_id: string
}

export default function Dashboard() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAlbums = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching albums:', error)
      } else {
        setAlbums(data || [])
      }

      setLoading(false)
    }

    fetchAlbums()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Albums</h1>

      {/* ✅ Render the album creation button */}
      <CreateAlbumButton />

      {albums.length === 0 ? (
        <p className="mt-4">No albums found. Click above to create one.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {albums.map((album) => (
            <li key={album.id}>
              <Link
                href={`/dashboard/albums/${album.id}`}
                className="text-purple-600 underline"
              >
                {album.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


