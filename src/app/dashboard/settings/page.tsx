import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { getUserDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function SettingsPage() {
  const user = await requireUser();
  const { memberships } = await getUserDashboardData(user.id);

  return (
    <DashboardShell currentPath="/dashboard/settings" teamLinks={memberships.map((membership) => membership.team)}>
      <Card className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Account</p>
        <h1 className="mt-3 text-3xl font-black text-[#111111]">Settings</h1>
        <div className="mt-6 space-y-4 rounded-3xl bg-black/[0.03] p-5">
          <div>
            <p className="text-sm text-[#6a6a6a]">Name</p>
            <p className="font-semibold text-[#111111]">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-[#6a6a6a]">Email</p>
            <p className="font-semibold text-[#111111]">{user.email}</p>
          </div>
          <p className="text-sm text-[#5a5a5a]">Credential management is currently handled through the signup/login flow and Prisma-backed user records.</p>
        </div>
      </Card>
    </DashboardShell>
  );
}
