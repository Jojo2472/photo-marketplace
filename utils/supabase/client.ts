// utils/supabase/client.ts

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Browser Supabase client (for client components)
export const createBrowserClient = () => createClientComponentClient<Database>();

// Server Supabase client (for server components and API routes)
export const createServerClient = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );




