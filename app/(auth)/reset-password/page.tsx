"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center px-4">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-center text-lg font-bold text-purple-800 mb-4">
          Set a New Password
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your new password below to finish resetting your account.
        </p>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold transition"
        >
          {loading ? "Resetting..." : "Update Password"}
        </button>

        <div className="mt-6 text-center text-sm">
          Back to{" "}
          <Link href="/login" className="text-purple-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
