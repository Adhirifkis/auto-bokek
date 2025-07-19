"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState = { message: "" };

export default function RegisterPage() {
  const router = useRouter();
  const [statusMessage, formAction] = useActionState(
    registerUser,
    initialState
  );

  useEffect(() => {
    if (statusMessage.message === "Email sudah terdaftar") {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [statusMessage.message, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Daftar Akun
        </h2>

        {statusMessage.message && (
          <div
            className={`p-3 mb-3 text-sm rounded text-center ${
              statusMessage.message.includes("berhasil")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusMessage.message}
            {statusMessage.message === "Email sudah terdaftar" && (
              <div className="text-sm mt-2 text-gray-600">
                Mengalihkan ke halaman login...
              </div>
            )}
          </div>
        )}

        <Input name="name" placeholder="Nama" className="mb-3" />
        <Input name="email" placeholder="Email" type="email" className="mb-3" />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          className="mb-4"
        />

        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded"
        >
          Daftar
        </Button>
      </form>
    </div>
  );
}
