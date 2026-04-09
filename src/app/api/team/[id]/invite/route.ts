import { TeamRole } from "@prisma/client";
import { addDays } from "date-fns";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inviteMemberSchema } from "@/lib/schemas";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: id,
        userId: session.user.id,
      },
    },
  });

  if (!membership || membership.role !== TeamRole.OWNER) {
    return NextResponse.json({ error: "Only owners can invite members." }, { status: 403 });
  }

  try {
    const body = inviteMemberSchema.parse(await request.json());
    const token = randomBytes(20).toString("hex");

    const invite = await prisma.invite.create({
      data: {
        teamId: id,
        email: body.email,
        role: body.role,
        token,
        expiresAt: addDays(new Date(), 7),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const inviteUrl = `${baseUrl.replace(/\/$/, "")}/invite/${invite.token}`;

    return NextResponse.json({ invite, inviteUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create invite." },
      { status: 400 },
    );
  }
}
