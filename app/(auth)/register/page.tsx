// app/(auth)/register/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "good" | "strong" | ""
  >("");

  const getStrength = (pwd: string) => {
    if (pwd.length < 6) return "weak";
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && pwd.length >= 8) return "strong";
    return "good";
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setPasswordStrength(getStrength(pwd));
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role },
        emailRedirectTo: `${location.origin}/verify`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to verify your account");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center px-4">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-center text-lg font-bold text-purple-800 mb-4">
          Create an Account
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
          onChange={(e) => handlePasswordChange(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none"
        />

        <div className="flex justify-between mb-4">
          <button
            onClick={() => setRole("buyer")}
            className={`w-full mr-1 px-4 py-2 rounded font-medium text-white ${
              role === "buyer" ? "bg-purple-700" : "bg-purple-500"
            }`}
          >
            👤 Buyer
          </button>
          <button
            onClick={() => setRole("seller")}
            className={`w-full ml-1 px-4 py-2 rounded font-medium text-white ${
              role === "seller" ? "bg-purple-700" : "bg-purple-500"
            }`}
          >
            📦 Seller
          </button>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
