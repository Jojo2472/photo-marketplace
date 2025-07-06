'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type UploadModalProps = {
  albumId: string
}

export default function UploadModal({ albumId }: UploadModalProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('albumId', albumId)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      router.refresh()
    } else {
      alert('Upload failed')
    }

    setUploading(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Upload Photo</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}
