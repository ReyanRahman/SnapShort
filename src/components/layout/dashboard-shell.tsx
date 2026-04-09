import Link from "next/link";
import { BarChart3, Link2, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({
  children,
  currentPath,
  teamLinks,
}: {
  children: React.ReactNode;
  currentPath: string;
  teamLinks: Array<{ id: string; name: string }>;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="h-fit rounded-[28px] border border-black/8 bg-white p-4 shadow-sm">
        <div className="mb-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Workspace</p>
          <p className="mt-2 text-lg font-semibold text-[#111111]">Manage links and teams</p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                  active ? "bg-[#111111] text-white" : "text-[#4b4b4b] hover:bg-black/[0.04]",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {teamLinks.length > 0 ? (
          <div className="mt-6 border-t border-black/6 pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Teams</p>
            <div className="space-y-1">
              {teamLinks.map((team) => {
                const href = `/dashboard/team/${team.id}`;
                const active = currentPath === href;

                return (
                  <Link
                    key={team.id}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                      active ? "bg-[#111111] text-white" : "text-[#4b4b4b] hover:bg-black/[0.04]",
                    )}
                  >
                    <Users className="h-4 w-4" />
                    {team.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </aside>

      <main>{children}</main>
    </div>
  );
}
