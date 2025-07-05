// app/dashboard/albums/[albumId]/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AlbumPage({
  params,
}: {
  params: { albumId: string }
}) {
  const router = useRouter()

  useEffect(() => {
    router.push(`/dashboard/albums/${params.albumId}/upload`)
  }, [params.albumId, router])

  return null
}
