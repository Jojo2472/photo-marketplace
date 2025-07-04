// app/(auth)/verify-email/page.tsx
export default function VerifyEmailPage() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      <p className="text-gray-700">
        We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
      </p>
    </div>
  );
}
