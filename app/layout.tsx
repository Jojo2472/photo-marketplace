'use client'

import './globals.css'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { type Session } from '@supabase/auth-helpers-nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Session>())

  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabaseClient}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  )
}

