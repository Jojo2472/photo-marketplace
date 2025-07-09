'use client'

import './globals.css'
import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { Database } from '@/types/supabase' // make sure path is correct

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Create Supabase client once per session
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>())

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

