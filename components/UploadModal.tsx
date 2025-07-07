'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

interface UploadModalProps {
  open: boolean
  onClose: () => void
  albumId: string
}

export default function UploadModal({ open, onClose, albumId }: UploadModalProps) {
  const [photo, setPhoto] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!photo) return

    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', photo)
    formData.append('albumId', albumId)

    const res = await fetch(`/api/photos`, {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      onClose()
      window.location.reload() // refresh the album view
    } else {
      alert('Upload failed.')
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a Photo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="w-full"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            {isLoading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


