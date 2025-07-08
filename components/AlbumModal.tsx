'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Album } from "@/types"

interface AlbumModalProps {
  open: boolean
  onClose: () => void
  onAlbumCreated: React.Dispatch<React.SetStateAction<Album[]>>
}

export function AlbumModal({ open, onClose, onAlbumCreated }: AlbumModalProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(formRef.current!)
    const res = await fetch("/api/albums", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      onAlbumCreated(data) // Pass updated albums back to parent
      onClose()
    } else {
      alert(data.error || "Something went wrong.")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Album</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Album Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">Album Cover</Label>
            <Input id="cover" name="cover" type="file" accept="image/*" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

