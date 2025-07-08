'use client'

import './globals.css'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

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

