// app/api/auth/register/route.ts
import { createClient } from '@/utils/supabase/client';
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { email, password, username, role } = await req.json();

    if (!email || !password || !username || !role) {
      return new Response('Missing fields', { status: 400 });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
      },
    });

    if (error) {
      console.error(error);
      return new Response(error.message, { status: 400 });
    }

    await sendVerificationEmail(email);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error('Registration error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
