// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password, username, role } = await req.json();

  if (!email || !password || !username || !role) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  // Check if user already exists
  const { data: existingUser, error: lookupError } = await supabase
    .from('User')
    .select('*')
    .eq('email', email)
    .single();

  if (lookupError && lookupError.code !== 'PGRST116') {
    console.error('User lookup error:', lookupError);
    return NextResponse.json({ message: 'Failed to check user' }, { status: 500 });
  }

  if (existingUser) {
    return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
  }

  const hashedPassword = await hash(password, 10);
  const verifyToken = randomBytes(32).toString('hex');

  const { error } = await supabase.from('User').insert({
    email,
    password: hashedPassword,
    username,
    role,
    email_verified: false,
    verify_token: verifyToken,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }

  // ✅ Send real verification email
  await sendVerificationEmail(email, verifyToken);

  return NextResponse.json({ message: 'User created. Please verify your email.' });
}
