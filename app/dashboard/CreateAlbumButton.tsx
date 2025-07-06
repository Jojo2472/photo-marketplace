// app/dashboard/CreateAlbumButton.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'


export default function CreateAlbumButton() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [albumName, setAlbumName] = useState('')
  const [creating, setCreating] = useState(false)

  const supabase = createBrowserClient()


  const handleCreate = async () => {
    if (!albumName.trim()) {
      alert('Album name is required.')
      return
    }

    setCreating(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      alert('You must be logged in.')
      setCreating(false)
      return
    }

    const { data, error } = await supabase
      .from('albums')
      .insert([{ name: albumName.trim(), user_id: session.user.id }])
      .select()
      .single()

    if (error || !data) {
      alert('Failed to create album.')
      console.error(error)
      setCreating(false)
      return
    }

    setShowModal(false)
    setCreating(false)
    setAlbumName('')
    router.push(`/dashboard/albums/${data.id}`)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        + Create New Album
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Album</h2>
            <input
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Enter album name"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


