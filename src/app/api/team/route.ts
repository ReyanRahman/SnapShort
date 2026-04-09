import { TeamRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTeamSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = createTeamSchema.parse(await request.json());

    const team = await prisma.team.create({
      data: {
        name: body.name,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: TeamRole.OWNER,
          },
        },
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create team." },
      { status: 400 },
    );
  }
}
