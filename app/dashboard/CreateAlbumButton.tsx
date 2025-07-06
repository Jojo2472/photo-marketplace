// app/dashboard/CreateAlbumButton.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createComponentClient } from '@/utils/supabase/client'

export default function CreateAlbumButton() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const supabase = createComponentClient() // ✅ Frontend-safe Supabase client

  const handleCreate = async () => {
    setCreating(true)

    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      alert('You must be logged in.')
      setCreating(false)
      return
    }

    const response = await supabase
      .from('albums')
      .insert({ name: 'New Album', user_id: user.id })
      .select()
      .single()

    if (response.error) {
      alert('Failed to create album: ' + response.error.message)
      setCreating(false)
      return
    }

    const albumId = response.data.id
    router.push(`/dashboard/albums/${albumId}`)

  }

  return (
    <button
      onClick={handleCreate}
      disabled={creating}
      className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
    >
      {creating ? 'Creating...' : '+ Create New Album'}
    </button>
  )
}

