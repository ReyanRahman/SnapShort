import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { canManageLinks } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { updateLinkSchema } from "@/lib/schemas";
import { isReservedSlug, normalizeSlug } from "@/lib/urls";

async function getEditableLink(id: string, userId: string) {
  return prisma.link.findFirst({
    where: {
      id,
      isArchived: false,
      OR: [
        { createdByUserId: userId },
        {
          team: {
            members: {
              some: {
                userId,
                role: { in: ["OWNER", "EDITOR"] },
              },
            },
          },
        },
      ],
    },
    include: {
      team: {
        include: {
          members: {
            where: { userId },
          },
        },
      },
      visits: true,
    },
  });
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const link = await prisma.link.findFirst({
    where: {
      id,
      isArchived: false,
      OR: [
        { createdByUserId: session.user.id },
        {
          team: {
            members: {
              some: { userId: session.user.id },
            },
          },
        },
      ],
    },
    include: {
      team: true,
      visits: true,
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({ link });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const link = await getEditableLink(id, session.user.id);

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  if (link.teamId) {
    const role = link.team?.members[0]?.role;

    if (!canManageLinks(role)) {
      return NextResponse.json({ error: "You do not have permission to edit this link." }, { status: 403 });
    }
  }

  try {
    const body = updateLinkSchema.parse(await request.json());
    const slug = body.slug ? normalizeSlug(body.slug) ?? undefined : undefined;

    if (slug && isReservedSlug(slug)) {
      return NextResponse.json({ error: "That alias is reserved." }, { status: 400 });
    }

    if (slug && slug !== link.slug) {
      const existing = await prisma.link.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (existing) {
        return NextResponse.json({ error: "That alias is already in use." }, { status: 409 });
      }
    }

    const updated = await prisma.link.update({
      where: { id },
      data: {
        originalUrl: body.originalUrl,
        title: body.title === "" ? undefined : body.title,
        slug,
        isActive: body.isActive,
        expiresAt: body.expiresAt === null ? null : body.expiresAt ? new Date(body.expiresAt) : undefined,
      },
    });

    return NextResponse.json({ link: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update link." },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const link = await getEditableLink(id, session.user.id);

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  await prisma.link.update({
    where: { id },
    data: { isArchived: true, isActive: false },
  });

  return NextResponse.json({ ok: true });
}
