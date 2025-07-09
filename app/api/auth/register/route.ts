// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // <- import server client here
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';

export async function POST(req: NextRequest) {
  const supabase = createClient(); // no arguments here

  try {
    const { email, password, username, role } = await req.json();

    if (!email || !password || !username || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
      },
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await sendVerificationEmail(email, `${process.env.NEXT_PUBLIC_SITE_URL}/verify`);

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
