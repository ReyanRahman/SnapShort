"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("Invalid email or password.");
      setIsPending(false);
      return;
    }

    window.location.href = result.url ?? "/dashboard";
  }

  return (
    <Card className="w-full max-w-md p-6 md:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Welcome back</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111111]">Sign in to manage your links.</h1>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p className="text-sm font-medium text-[#b93810]">{error}</p> : null}

        <Button className="w-full" disabled={isPending} size="lg" type="submit">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
