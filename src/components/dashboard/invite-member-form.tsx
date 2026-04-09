"use client";

import { TeamRole } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function InviteMemberForm({ teamId }: { teamId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>(TeamRole.EDITOR);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsPending(true);

    const response = await fetch(`/api/team/${teamId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Could not send invite.");
      setIsPending(false);
      return;
    }

    setEmail("");
    setRole(TeamRole.EDITOR);
    setMessage(`Invite ready: ${data.inviteUrl}`);
    setIsPending(false);
  }

  return (
    <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_auto]" onSubmit={handleSubmit}>
      <Input type="email" placeholder="teammate@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Select value={role} onChange={(event) => setRole(event.target.value as TeamRole)}>
        <option value={TeamRole.EDITOR}>Editor</option>
        <option value={TeamRole.VIEWER}>Viewer</option>
        <option value={TeamRole.OWNER}>Owner</option>
      </Select>
      <Button disabled={isPending} type="submit">
        {isPending ? "Inviting..." : "Invite"}
      </Button>
      {message ? <p className="md:col-span-3 text-sm text-[#0d7a41]">{message}</p> : null}
      {error ? <p className="md:col-span-3 text-sm text-[#b93810]">{error}</p> : null}
    </form>
  );
}
