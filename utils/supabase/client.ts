// utils/supabase/client.ts
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Browser (client-side) Supabase client
export const createComponentClient = () => createClientComponentClient()

// Server Supabase client (you can also import this from utils/supabase/server.ts)
export const createSupabaseClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// For backend routes or wherever you need the server Supabase client
export { createSupabaseClient as createClient }
