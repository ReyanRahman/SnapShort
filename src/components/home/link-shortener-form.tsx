"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type TeamOption = {
  id: string;
  name: string;
};

type FormState = {
  shortUrl: string;
  slug: string;
  message: string;
};

export function LinkShortenerForm({ teams }: { teams: TeamOption[] }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [teamId, setTeamId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [result, setResult] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const minExpiry = useMemo(() => new Date().toISOString().slice(0, 16), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setIsPending(true);

    try {
      const payload = {
        originalUrl,
        slug,
        title,
        teamId,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : "",
      };

      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not create the short link.");
      }

      setResult({
        shortUrl: data.shortUrl,
        slug: data.slug,
        message: "Short link created successfully.",
      });
      setOriginalUrl("");
      setSlug("");
      setTitle("");
      setExpiresAt("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="overflow-hidden bg-white/95">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff0ea] px-3 py-1 text-xs font-semibold text-[#b93810]">
            <Sparkles className="h-3.5 w-3.5" />
            Launch-ready short links
          </div>

          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-[#111111] md:text-6xl">
            Shrink any URL into something fast, clean, and shareable.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5a5a5a] md:text-lg">
            Create guest links instantly, then unlock analytics, team workspaces, and lifecycle controls with an account.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Paste a long URL here"
              type="url"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Custom alias (optional)"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
              <Input
                placeholder="Campaign or title (optional)"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select value={teamId} onChange={(event) => setTeamId(event.target.value)}>
                <option value="">Personal or guest link</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    Share in {team.name}
                  </option>
                ))}
              </Select>

              <Input
                min={minExpiry}
                type="datetime-local"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={isPending} size="lg" type="submit">
                {isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Creating link
                  </>
                ) : (
                  "Create short link"
                )}
              </Button>
              <p className="text-sm text-[#6a6a6a]">Guests can create links immediately. Accounts unlock editing and teams.</p>
            </div>
          </form>

          {error ? <p className="mt-4 text-sm font-medium text-[#b93810]">{error}</p> : null}

          {result ? (
            <Card className="mt-6 border-[#ff6a3d]/20 bg-[#fffaf7] p-5">
              <p className="text-sm font-semibold text-[#111111]">{result.message}</p>
              <a className="mt-2 block text-lg font-black text-[#b93810]" href={result.shortUrl}>
                {result.shortUrl}
              </a>
              <p className="mt-1 text-sm text-[#5a5a5a]">Slug: {result.slug}</p>
            </Card>
          ) : null}
        </div>

        <div className="rounded-[24px] bg-[#111111] p-6 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">What ships in v1</p>
          <div className="mt-6 space-y-4">
            {[
              "Auto or custom short codes",
              "Guest and authenticated flows",
              "Daily clicks, top countries, referrers",
              "Active / inactive states and expiry controls",
              "Shared team workspaces with roles",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/6 px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
