import { Activity, Link2, ShieldCheck, TimerReset } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const items = [
  { key: "totalLinks", label: "Total links", icon: Link2 },
  { key: "totalClicks", label: "Total clicks", icon: Activity },
  { key: "activeLinks", label: "Active links", icon: ShieldCheck },
  { key: "expiringSoon", label: "Expiring soon", icon: TimerReset },
] as const;

export function SummaryCards({
  stats,
}: {
  stats: Record<(typeof items)[number]["key"], number>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6a6a6a]">{item.label}</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-[#111111]">{formatNumber(stats[item.key])}</p>
              </div>
              <div className="rounded-2xl bg-[#fff0ea] p-3 text-[#b93810]">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
