// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { signJwt } from '@/lib/jwt' // ✅ Make sure this matches your actual file location
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  })

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || 'Invalid credentials' }, { status: 401 })
  }

  // ✅ Create token with user's id and email
  const token = signJwt({
    id: data.user.id,
    email: data.user.email,
  })

  // ✅ Set the token as a cookie
  const res = NextResponse.json({ message: 'Logged in!' })
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res
}
