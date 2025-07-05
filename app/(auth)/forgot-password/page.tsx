"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent!");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center px-4">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-center text-lg font-bold text-purple-800 mb-4">
          Forgot Your Password?
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your email below and we'll send you a link to reset your password.
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
        />

        <button
          onClick={handleResetRequest}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold transition"
        >
          {loading ? "Sending Link..." : "Send Reset Link"}
        </button>

        <div className="mt-6 text-center text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="text-purple-600 hover:underline font-medium">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
