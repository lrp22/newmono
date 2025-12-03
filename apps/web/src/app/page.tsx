"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name: "User",
      },
      {
        onSuccess: () => {
          router.push("/todos");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  const handleSignIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/todos");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold">Welcome</h1>

      <div className="w-full max-w-sm space-y-4">
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2">
          <Button onClick={handleSignIn} className="flex-1">
            Sign In
          </Button>
          <Button onClick={handleSignUp} variant="outline" className="flex-1">
            Sign Up
          </Button>
        </div>
      </div>

      <Link href="/todos" className="text-blue-500 hover:underline">
        Go to Todos (Protected)
      </Link>
    </div>
  );
}
