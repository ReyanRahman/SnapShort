import { LinkManager } from "@/components/dashboard/link-manager";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getUserDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function DashboardLinksPage() {
  const user = await requireUser();
  const { links, memberships } = await getUserDashboardData(user.id);

  return (
    <DashboardShell currentPath="/dashboard/links" teamLinks={memberships.map((membership) => membership.team)}>
      <LinkManager
        initialLinks={links.map((link) => ({
          id: link.id,
          slug: link.slug,
          originalUrl: link.originalUrl,
          title: link.title,
          isActive: link.isActive,
          expiresAt: link.expiresAt?.toISOString() ?? null,
          workspace: link.team?.name ?? "Personal",
          clicks: link.visits.length,
        }))}
      />
    </DashboardShell>
  );
}
