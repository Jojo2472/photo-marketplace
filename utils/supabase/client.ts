'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Browser (client-side) Supabase client
export const createComponentClient = () => createClientComponentClient()

// Server Supabase client (you can also import this from utils/supabase/server.ts)
export const createServerClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
