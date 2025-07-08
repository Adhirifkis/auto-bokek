"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-600 px-4">
      <div className="w-full max-w-md p-8 rounded-lg shadow-2xl bg-white border border-yellow-600">
        <h1 className="text-center text-3xl font-bold text-yellow-700 mb-6">
          Login Auto Bokek
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 border border-red-300">
            <strong className="block">Terjadi Kesalahan:</strong>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-2 border border-yellow-500 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-2 border border-yellow-500 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
