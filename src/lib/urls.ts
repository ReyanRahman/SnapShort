import { createHash, randomBytes } from "crypto";

import { RESERVED_SLUGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export function normalizeSlug(input?: string | null) {
  const value = input?.trim();
  return value ? value.toLowerCase() : null;
}

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export async function generateUniqueSlug(length = 7) {
  for (let index = 0; index < 10; index += 1) {
    const slug = randomBytes(length).toString("base64url").slice(0, length).toLowerCase();

    if (isReservedSlug(slug)) {
      continue;
    }

    const existing = await prisma.link.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }
  }

  throw new Error("Could not generate a unique short code.");
}

export function buildShortUrl(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/${slug}`;
}

export function hashIp(ip?: string | null) {
  if (!ip) {
    return null;
  }

  return createHash("sha256").update(ip).digest("hex");
}
