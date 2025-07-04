// app/api/auth/register/route.ts
import { createClient } from '@/utils/supabase/server';
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { email, password, username, role } = await req.json();

    if (!email || !password || !username || !role) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Create Supabase user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role }, // this goes into `auth.users.user_metadata`
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email`,
      },
    });

    if (error) {
      console.error('Supabase signUp error:', error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // Optional: Send your own custom verification email too
    await sendVerificationEmail(email, `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email`);

    return new Response(JSON.stringify({ message: 'Check your email to verify your account.' }), { status: 201 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
