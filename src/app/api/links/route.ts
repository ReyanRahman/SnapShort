import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { canManageLinks } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { createLinkSchema } from "@/lib/schemas";
import { buildShortUrl, generateUniqueSlug, hashIp, isReservedSlug, normalizeSlug } from "@/lib/urls";

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

    if (!checkRateLimit(`create:${hashIp(forwardedFor) ?? forwardedFor}`)) {
      return NextResponse.json({ error: "Too many create requests. Please wait a minute and try again." }, { status: 429 });
    }

    const body = createLinkSchema.parse(await request.json());
    const slug = normalizeSlug(body.slug) ?? (await generateUniqueSlug());

    if (isReservedSlug(slug)) {
      return NextResponse.json({ error: "That alias is reserved." }, { status: 400 });
    }

    const existing = await prisma.link.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: "That alias is already in use." }, { status: 409 });
    }

    let teamId: string | null = null;

    if (body.teamId) {
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Please sign in to create a team link." }, { status: 401 });
      }

      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: body.teamId,
            userId: session.user.id,
          },
        },
      });

      if (!canManageLinks(membership?.role)) {
        return NextResponse.json({ error: "You do not have permission to create links in this team." }, { status: 403 });
      }

      teamId = body.teamId;
    }

    const link = await prisma.link.create({
      data: {
        slug,
        originalUrl: body.originalUrl,
        title: body.title || null,
        createdByUserId: session?.user?.id ?? null,
        teamId,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });

    return NextResponse.json(
      {
        id: link.id,
        slug: link.slug,
        shortUrl: buildShortUrl(link.slug),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create short link." },
      { status: 400 },
    );
  }
}
