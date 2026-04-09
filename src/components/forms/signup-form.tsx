"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Could not create your account.");
      setIsPending(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <Card className="w-full max-w-md p-6 md:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Create account</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111111]">Start tracking, managing, and sharing links.</h1>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p className="text-sm font-medium text-[#b93810]">{error}</p> : null}

        <Button className="w-full" disabled={isPending} size="lg" type="submit">
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Card>
  );
}
