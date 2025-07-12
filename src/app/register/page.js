"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/app/action";

const initialState = { message: "" };

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(registerUser, initialState);

  useEffect(() => {
    if (state.message === "Email sudah terdaftar") {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.message, router]);

  return (
    <div className="min-h-screen bg-[#FFD700] flex items-center justify-center">
      <form
        action={formAction}
        className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center">Daftar Akun</h2>

        {state.message && (
          <div
            className={`p-3 rounded text-sm text-center ${
              state.message.includes("berhasil")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {state.message}
            {state.message === "Email sudah terdaftar" && (
              <div className="text-sm mt-2 text-gray-600">
                Mengalihkan ke halaman login...
              </div>
            )}
          </div>
        )}

        <Input name="name" placeholder="Name" className="border p-2 rounded" />
        <Input
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
        />
        <Button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Daftar
        </Button>
      </form>
    </div>
  );
}
