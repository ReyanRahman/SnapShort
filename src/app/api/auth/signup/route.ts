import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = signupSchema.parse(await request.json());

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const passwordHash = await hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create account.",
      },
      { status: 400 },
    );
  }
}
