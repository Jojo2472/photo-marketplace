'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createComponentClient } from '@/utils/supabase/client'

export default function UploadModal({ albumId }: { albumId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createComponentClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      setError('You must be logged in to upload.')
      setUploading(false)
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase.from('photos').insert({
      album_id: albumId,
      user_id: user.id,
      file_path: filePath,
    })

    if (dbError) {
      setError(dbError.message)
      setUploading(false)
      return
    }

    router.push(`/dashboard/albums/${albumId}`)
  }

  const closeModal = () => {
    router.push(`/dashboard/albums/${albumId}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Upload Photo</h2>

        <input type="file" ref={fileInputRef} className="mb-4" />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  )
}
