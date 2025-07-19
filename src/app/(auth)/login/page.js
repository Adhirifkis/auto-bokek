"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { SocialLogin } from "@/app/(auth)/_components/social-login";

const initialStatus = { message: "", redirect: "" };

export default function LoginPage() {
  const router = useRouter();
  const [status, formAction] = useActionState(loginUser, initialStatus);

  const isSuccess = status.message?.toLowerCase().includes("berhasil");
  const isError = status.message && !isSuccess;

  useEffect(() => {
    if (status?.redirect) {
      const timeout = setTimeout(() => {
        router.push(status.redirect);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [status?.redirect, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login to Your Account
        </h2>

        {status.message && (
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
              {isSuccess ? "Login Successful" : "Login Failed"}
            </AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="mb-3"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="mb-4"
          required
        />
        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          Sign In
        </Button>

        <div className="mt-6">
          <SocialLogin />
        </div>
      </form>
    </div>
  );
}
