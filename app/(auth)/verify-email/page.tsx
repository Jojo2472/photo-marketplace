'use client'

import { useSearchParams } from 'next/navigation'
import { MailIcon } from 'lucide-react'
import { Button } from '@/components/Button'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-purple-300 px-4 py-10">
      <div className="max-w-md w-full text-center bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-6 sm:p-10">
        <div className="flex justify-center mb-4">
          <MailIcon className="h-12 w-12 text-purple-700" />
        </div>
        <h1 className="text-2xl font-semibold text-purple-900 mb-2">Verify your email</h1>
        <p className="text-sm text-gray-700 mb-4">
          We’ve sent a confirmation email to <span className="font-medium">{email}</span>.<br />
          Please click the link in that email to activate your account.
        </p>
        <p className="text-xs text-gray-600 mb-2">📭 Don’t see it? Check your spam or junk folder!</p>
        <Button className="w-full mt-2">Resend Email</Button>
      </div>
    </main>
  )
}
