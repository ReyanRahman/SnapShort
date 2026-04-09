"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate, formatNumber } from "@/lib/utils";

type ManagedLink = {
  id: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  isActive: boolean;
  expiresAt: string | null;
  workspace: string;
  clicks: number;
};

export function LinkManager({ initialLinks }: { initialLinks: ManagedLink[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [selectedId, setSelectedId] = useState<string | null>(initialLinks[0]?.id ?? null);
  const selectedLink = links.find((link) => link.id === selectedId) ?? null;
  const [formState, setFormState] = useState(() =>
    selectedLink
      ? {
          originalUrl: selectedLink.originalUrl,
          title: selectedLink.title ?? "",
          slug: selectedLink.slug,
          expiresAt: selectedLink.expiresAt ? new Date(selectedLink.expiresAt).toISOString().slice(0, 16) : "",
        }
      : {
          originalUrl: "",
          title: "",
          slug: "",
          expiresAt: "",
        },
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function selectLink(linkId: string) {
    const link = links.find((item) => item.id === linkId);
    setSelectedId(linkId);
    setMessage(null);
    setError(null);

    if (!link) return;

    setFormState({
      originalUrl: link.originalUrl,
      title: link.title ?? "",
      slug: link.slug,
      expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : "",
    });
  }

  async function updateLink(payload: Record<string, unknown>, successMessage: string) {
    if (!selectedId) return;

    setMessage(null);
    setError(null);

    const response = await fetch(`/api/links/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Could not update link.");
      return;
    }

    setLinks((current) =>
      current.map((link) =>
        link.id === selectedId
          ? {
              ...link,
              slug: data.link.slug,
              originalUrl: data.link.originalUrl,
              title: data.link.title,
              isActive: data.link.isActive,
              expiresAt: data.link.expiresAt,
            }
          : link,
      ),
    );

    setMessage(successMessage);
  }

  async function archiveLink() {
    if (!selectedId) return;

    setMessage(null);
    setError(null);

    const response = await fetch(`/api/links/${selectedId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Could not archive link.");
      return;
    }

    const remaining = links.filter((link) => link.id !== selectedId);
    setLinks(remaining);
    selectLink(remaining[0]?.id ?? "");
    setSelectedId(remaining[0]?.id ?? null);
    setMessage("Link archived.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="overflow-hidden">
        <div className="border-b border-black/6 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#111111]">Manage links</h2>
        </div>
        <div className="space-y-2 p-4">
          {links.map((link) => (
            <button
              key={link.id}
              className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                selectedId === link.id ? "border-[#ff6a3d]/40 bg-[#fff7f3]" : "border-black/6 bg-white hover:bg-black/[0.02]"
              }`}
              onClick={() => selectLink(link.id)}
              type="button"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#111111]">/{link.slug}</p>
                  <p className="mt-1 max-w-md truncate text-sm text-[#6a6a6a]">{link.title || link.originalUrl}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={link.isActive ? "success" : "danger"}>{link.isActive ? "Active" : "Inactive"}</Badge>
                  <span className="text-sm text-[#4b4b4b]">{formatNumber(link.clicks)} clicks</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        {selectedLink ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#6a6a6a]">Editing</p>
                <h2 className="mt-1 text-2xl font-black text-[#111111]">/{selectedLink.slug}</h2>
              </div>
              <Badge tone={selectedLink.isActive ? "success" : "danger"}>{selectedLink.isActive ? "Active" : "Inactive"}</Badge>
            </div>

            <div className="mt-6 space-y-4">
              <Input
                placeholder="Destination URL"
                value={formState.originalUrl}
                onChange={(event) => setFormState((current) => ({ ...current, originalUrl: event.target.value }))}
              />
              <Input
                placeholder="Title"
                value={formState.title}
                onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
              />
              <Input
                placeholder="Short alias"
                value={formState.slug}
                onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))}
              />
              <Input
                type="datetime-local"
                value={formState.expiresAt}
                onChange={(event) => setFormState((current) => ({ ...current, expiresAt: event.target.value }))}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  updateLink(
                    {
                      originalUrl: formState.originalUrl,
                      title: formState.title,
                      slug: formState.slug,
                      expiresAt: formState.expiresAt ? new Date(formState.expiresAt).toISOString() : null,
                    },
                    "Link details updated.",
                  )
                }
                type="button"
              >
                Save changes
              </Button>
              <Button
                onClick={() => updateLink({ isActive: !selectedLink.isActive }, selectedLink.isActive ? "Link disabled." : "Link enabled.")}
                type="button"
                variant="secondary"
              >
                {selectedLink.isActive ? "Disable" : "Enable"}
              </Button>
              <Button onClick={archiveLink} type="button" variant="destructive">
                Archive
              </Button>
            </div>

            <div className="mt-6 rounded-3xl bg-black/[0.03] p-4 text-sm text-[#4b4b4b]">
              <p>Workspace: {selectedLink.workspace}</p>
              <p className="mt-1">Clicks: {formatNumber(selectedLink.clicks)}</p>
              <p className="mt-1">Expiry: {formatDate(selectedLink.expiresAt)}</p>
            </div>

            {message ? <p className="mt-4 text-sm text-[#0d7a41]">{message}</p> : null}
            {error ? <p className="mt-4 text-sm text-[#b93810]">{error}</p> : null}
          </>
        ) : (
          <div className="text-sm text-[#5a5a5a]">No links available yet. Create your first one from the homepage.</div>
        )}
      </Card>
    </div>
  );
}
