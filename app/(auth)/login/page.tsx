// app/(auth)/login/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center px-4">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-center text-lg font-bold text-purple-800 mb-4">
          Login to Your Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />

        <div className="text-right text-sm mt-2 mb-4">
          <Link href="/forgot-password" className="text-purple-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-purple-600 hover:underline font-medium">
            Register instead
          </Link>
        </div>
      </div>
    </div>
  );
}
