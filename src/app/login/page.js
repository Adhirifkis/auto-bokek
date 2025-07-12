"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState = { message: "", redirect: "" };

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect);
    }
  }, [state?.redirect, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFD700]">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {state?.message && (
          <div
            className={`p-2 mb-3 text-sm rounded text-center ${
              state.message.includes("berhasil")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {state.message}
          </div>
        )}

        <Input name="email" type="email" placeholder="Email" className="mb-3" />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="mb-3"
        />
        <Button type="submit" className="w-full bg-blue-600 text-white">
          Login
        </Button>
      </form>
    </div>
  );
}
