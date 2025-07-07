'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

interface AlbumModalProps {
  open: boolean
  onClose: () => void
}

export default function AlbumModal({ open, onClose }: AlbumModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (cover) formData.append('cover', cover)

    const res = await fetch('/api/albums', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      onClose()
      window.location.reload() // optional: refresh album list
    } else {
      alert('Error creating album.')
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Album Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
            className="w-full"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            {isLoading ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
