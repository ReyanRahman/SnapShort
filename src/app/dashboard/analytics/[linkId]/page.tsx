import { notFound } from "next/navigation";

import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buildAnalyticsSummary, getLinkForUser, getUserDashboardData } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/utils";
import { requireUser } from "@/lib/session";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;
  const user = await requireUser();
  const [dashboard, link] = await Promise.all([getUserDashboardData(user.id), getLinkForUser(linkId, user.id)]);

  if (!link) {
    notFound();
  }

  const analytics = buildAnalyticsSummary(link.visits);

  return (
    <DashboardShell currentPath="" teamLinks={dashboard.memberships.map((membership) => membership.team)}>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#6a6a6a]">Analytics for</p>
              <h1 className="mt-2 text-3xl font-black text-[#111111]">/{link.slug}</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#5a5a5a]">{link.originalUrl}</p>
            </div>
            <Badge tone={link.isActive ? "success" : "danger"}>{link.isActive ? "Active" : "Inactive"}</Badge>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total clicks", value: analytics.totalClicks },
            { label: "Top referrer", value: analytics.topReferrers[0]?.label ?? "Direct" },
            { label: "Top country", value: analytics.topCountries[0]?.label ?? "Unknown" },
            { label: "Expires", value: formatDate(link.expiresAt) },
          ].map((item) => (
            <Card key={item.label} className="p-5">
              <p className="text-sm text-[#6a6a6a]">{item.label}</p>
              <p className="mt-3 text-2xl font-black text-[#111111]">
                {typeof item.value === "number" ? formatNumber(item.value) : item.value}
              </p>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-black text-[#111111]">Clicks by day</h2>
          <div className="mt-6">
            <AnalyticsChart data={analytics.clicksByDay} />
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Top countries", items: analytics.topCountries },
            { title: "Top referrers", items: analytics.topReferrers },
            { title: "Top devices", items: analytics.topDevices },
          ].map((section) => (
            <Card key={section.title} className="p-6">
              <h2 className="text-lg font-semibold text-[#111111]">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <div key={`${section.title}-${item.label}`} className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3">
                    <span className="text-sm text-[#4b4b4b]">{item.label}</span>
                    <span className="font-semibold text-[#111111]">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
