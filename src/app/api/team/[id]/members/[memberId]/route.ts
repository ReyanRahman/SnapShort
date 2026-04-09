import { TeamRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTeamMemberSchema } from "@/lib/schemas";

export async function PATCH(request: Request, context: { params: Promise<{ id: string; memberId: string }> }) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, memberId } = await context.params;

  const actingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: id,
        userId: session.user.id,
      },
    },
  });

  if (!actingMember || actingMember.role !== TeamRole.OWNER) {
    return NextResponse.json({ error: "Only owners can update member roles." }, { status: 403 });
  }

  try {
    const body = updateTeamMemberSchema.parse(await request.json());

    const member = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role: body.role },
    });

    return NextResponse.json({ member });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update member role." },
      { status: 400 },
    );
  }
}
