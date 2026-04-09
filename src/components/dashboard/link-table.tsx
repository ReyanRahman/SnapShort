import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/utils";

type LinkRow = {
  id: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  team?: { name: string | null } | null;
  visits: Array<{ id: string }>;
};

export function LinkTable({ links }: { links: LinkRow[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-black/6 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#111111]">Latest links</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black/[0.02] text-[#6a6a6a]">
            <tr>
              <th className="px-6 py-3 font-medium">Link</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Clicks</th>
              <th className="px-6 py-3 font-medium">Expiry</th>
              <th className="px-6 py-3 font-medium">Workspace</th>
              <th className="px-6 py-3 font-medium">Analytics</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-t border-black/6">
                <td className="px-6 py-4">
                  <p className="font-semibold text-[#111111]">/{link.slug}</p>
                  <p className="max-w-sm truncate text-[#6a6a6a]">{link.title || link.originalUrl}</p>
                </td>
                <td className="px-6 py-4">
                  <Badge tone={link.isActive ? "success" : "danger"}>{link.isActive ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="px-6 py-4 text-[#111111]">{formatNumber(link.visits.length)}</td>
                <td className="px-6 py-4 text-[#111111]">{formatDate(link.expiresAt)}</td>
                <td className="px-6 py-4 text-[#111111]">{link.team?.name ?? "Personal"}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/analytics/${link.id}`}>
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
