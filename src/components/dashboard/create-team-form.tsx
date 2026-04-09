"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateTeamForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsPending(true);

    const response = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Could not create the team.");
      setIsPending(false);
      return;
    }

    setMessage("Team created. Refresh the dashboard to see it in the sidebar.");
    setName("");
    setIsPending(false);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input placeholder="New team name" value={name} onChange={(event) => setName(event.target.value)} required />
      <Button disabled={isPending} type="submit">
        {isPending ? "Creating..." : "Create team"}
      </Button>
      {message ? <p className="text-sm text-[#0d7a41]">{message}</p> : null}
      {error ? <p className="text-sm text-[#b93810]">{error}</p> : null}
    </form>
  );
}
