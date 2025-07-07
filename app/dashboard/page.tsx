// /app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export default function DashboardPage() {
  const supabase = createSupabaseBrowserClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error('Error fetching user:', error.message)
      } else {
        setUserEmail(user?.email ?? null)
      }
    }

    fetchUser()
  }, [supabase])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      {userEmail ? (
        <p>You're logged in as <strong>{userEmail}</strong></p>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  )
}


