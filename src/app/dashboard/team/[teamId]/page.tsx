import { notFound } from "next/navigation";

import { InviteMemberForm } from "@/components/dashboard/invite-member-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTeamForUser, getUserDashboardData } from "@/lib/data";
import { canManageTeam } from "@/lib/permissions";
import { formatDate, formatNumber } from "@/lib/utils";
import { requireUser } from "@/lib/session";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const user = await requireUser();
  const [dashboard, team] = await Promise.all([getUserDashboardData(user.id), getTeamForUser(teamId, user.id)]);

  if (!team) {
    notFound();
  }

  const currentMember = team.members.find((member) => member.userId === user.id);

  return (
    <DashboardShell currentPath={`/dashboard/team/${teamId}`} teamLinks={dashboard.memberships.map((membership) => membership.team)}>
      <div className="space-y-6">
        <Card className="p-6">
          <p className="text-sm text-[#6a6a6a]">Team workspace</p>
          <h1 className="mt-2 text-3xl font-black text-[#111111]">{team.name}</h1>
          <p className="mt-2 text-sm text-[#5a5a5a]">
            {formatNumber(team.links.length)} shared links, {formatNumber(team.members.length)} members, {formatNumber(team.invites.length)} pending invites.
          </p>
        </Card>

        {canManageTeam(currentMember?.role) ? (
          <Card className="p-6">
            <h2 className="text-xl font-black text-[#111111]">Invite teammates</h2>
            <p className="mt-2 text-sm text-[#5a5a5a]">
              Owners can create invite links for editors, viewers, or another owner.
            </p>
            <div className="mt-5">
              <InviteMemberForm teamId={team.id} />
            </div>
          </Card>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-black text-[#111111]">Members</h2>
            <div className="mt-4 space-y-3">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3">
                  <div>
                    <p className="font-semibold text-[#111111]">{member.user.name}</p>
                    <p className="text-sm text-[#6a6a6a]">{member.user.email}</p>
                  </div>
                  <Badge tone={member.role === "OWNER" ? "warning" : member.role === "EDITOR" ? "success" : "neutral"}>
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-[#111111]">Pending invites</h2>
            <div className="mt-4 space-y-3">
              {team.invites.length ? (
                team.invites.map((invite) => (
                  <div key={invite.id} className="rounded-2xl bg-black/[0.03] px-4 py-3">
                    <p className="font-semibold text-[#111111]">{invite.email}</p>
                    <p className="text-sm text-[#6a6a6a]">
                      {invite.role} • expires {formatDate(invite.expiresAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6a6a6a]">No pending invites yet.</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-black text-[#111111]">Shared links</h2>
          <div className="mt-4 space-y-3">
            {team.links.map((link) => (
              <div key={link.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/[0.03] px-4 py-3">
                <div>
                  <p className="font-semibold text-[#111111]">/{link.slug}</p>
                  <p className="text-sm text-[#6a6a6a]">{link.originalUrl}</p>
                </div>
                <div className="text-sm text-[#4b4b4b]">{formatNumber(link.visits.length)} clicks</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
