// utils/supabase/client.ts
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseServerClient } from '@supabase/supabase-js'

export const createSupabaseBrowserClient = () =>
  createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

export const createComponentClient = () => createClientComponentClient()

// 👇 THIS is the missing export needed by your backend routes
export { createSupabaseServerClient as createClient }



