import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await getServerAuthSession();

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      team: true,
    },
  });

  if (!invite || invite.status !== "PENDING") {
    notFound();
  }

  if (!session?.user) {
    redirect(`/login?callbackUrl=/invite/${token}`);
  }

  async function acceptInvite() {
    "use server";

    const latestSession = await getServerAuthSession();
    if (!latestSession?.user) {
      redirect(`/login?callbackUrl=/invite/${token}`);
    }

    const freshInvite = await prisma.invite.findUnique({
      where: { token },
    });

    if (!freshInvite || freshInvite.status !== "PENDING" || freshInvite.expiresAt < new Date()) {
      return;
    }

    await prisma.$transaction([
      prisma.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: freshInvite.teamId,
            userId: latestSession.user.id,
          },
        },
        create: {
          teamId: freshInvite.teamId,
          userId: latestSession.user.id,
          role: freshInvite.role,
        },
        update: {
          role: freshInvite.role,
        },
      }),
      prisma.invite.update({
        where: { id: freshInvite.id },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
          invitedUserId: latestSession.user.id,
        },
      }),
    ]);

    redirect(`/dashboard/team/${freshInvite.teamId}`);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center px-6 py-12">
      <Card className="w-full p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Team invite</p>
        <h1 className="mt-3 text-3xl font-black text-[#111111]">Join {invite.team.name}</h1>
        <p className="mt-3 text-sm leading-7 text-[#5a5a5a]">
          You were invited as a {invite.role.toLowerCase()} for this workspace. Accept the invite to access shared links and analytics.
        </p>
        <form action={acceptInvite} className="mt-6">
          <Button size="lg" type="submit">
            Accept invite
          </Button>
        </form>
        <p className="mt-4 text-sm text-[#5a5a5a]">
          Want to go back?{" "}
          <Link className="font-semibold text-[#b93810]" href="/dashboard">
            Return to dashboard
          </Link>
        </p>
      </Card>
    </main>
  );
}
