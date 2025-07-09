// utils/supabase/client.ts

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Create Supabase client for browser (client-side)
export const createBrowserClient = () => createClientComponentClient<Database>();

// Create Supabase client for server usage (without arguments)
export const createServerClient = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );




