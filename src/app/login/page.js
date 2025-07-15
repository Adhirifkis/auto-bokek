"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

const initialStatus = { message: "", redirect: "" };

export default function LoginPage() {
  const router = useRouter();
  const [statusMessage, formAction] = useActionState(loginUser, initialStatus);

  useEffect(() => {
    if (statusMessage?.redirect) {
      const timeout = setTimeout(() => {
        router.push(statusMessage.redirect);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [statusMessage?.redirect, router]);

  const isSuccess = statusMessage.message?.toLowerCase().includes("berhasil");
  const isError = statusMessage.message && !isSuccess;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login
        </h2>

        {statusMessage.message && (
          <Alert
            variant={isSuccess ? "default" : "destructive"}
            className="mb-4"
          >
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <AlertTitle>
              {isSuccess ? "Login Berhasil!" : "Gagal Login"}
            </AlertTitle>
            <AlertDescription>{statusMessage.message}</AlertDescription>
          </Alert>
        )}

        <Input name="email" type="email" placeholder="Email" className="mb-3" />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="mb-4"
        />
        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
