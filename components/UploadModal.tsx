'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function UploadModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const albumId = searchParams.get('upload') ? window.location.pathname.split('/').pop() : null

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file || !albumId) return alert('Missing file or album ID.')

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('albumId', albumId)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      alert('Upload failed.')
      setUploading(false)
      return
    }

    // success
    router.replace(window.location.pathname) // refresh without ?upload param
  }

  if (!searchParams.get('upload')) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-md">
        <button
          onClick={() => router.replace(window.location.pathname)}
          className="absolute top-2 right-3 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Upload Photo</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  )
}
