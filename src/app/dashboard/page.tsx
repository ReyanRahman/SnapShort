import { CreateTeamForm } from "@/components/dashboard/create-team-form";
import { LinkTable } from "@/components/dashboard/link-table";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { getUserDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();
  const { links, memberships, stats } = await getUserDashboardData(user.id);

  return (
    <DashboardShell currentPath="/dashboard" teamLinks={memberships.map((membership) => membership.team)}>
      <div className="space-y-6">
        <SummaryCards stats={stats} />

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <LinkTable links={links.slice(0, 8)} />
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Teams</p>
            <h2 className="mt-3 text-2xl font-black text-[#111111]">Create a shared workspace.</h2>
            <p className="mt-2 text-sm leading-7 text-[#5a5a5a]">
              Owners can invite editors and viewers, then manage shared short links in one place.
            </p>
            <div className="mt-5">
              <CreateTeamForm />
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
