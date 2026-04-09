import { ArrowRight, BarChart3, Link2, Users } from "lucide-react";

import { LinkShortenerForm } from "@/components/home/link-shortener-form";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await getServerAuthSession();
  const memberships = session?.user?.id
    ? await prisma.teamMember.findMany({
        where: { userId: session.user.id },
        include: {
          team: {
            select: { id: true, name: true },
          },
        },
      })
    : [];

  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-12 md:pt-16">
        <LinkShortenerForm teams={memberships.map((membership) => membership.team)} />
      </section>

      <section id="features" className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-10 md:grid-cols-3">
        {[
          {
            icon: Link2,
            title: "Flexible link creation",
            copy: "Generate slugs automatically or choose branded aliases for campaigns, products, and shared docs.",
          },
          {
            icon: BarChart3,
            title: "Detailed analytics",
            copy: "Track daily clicks, countries, referrers, browsers, and devices from a single dashboard.",
          },
          {
            icon: Users,
            title: "Team workspaces",
            copy: "Invite teammates, assign roles, and keep shared links organized without losing ownership controls.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ea] text-[#b93810]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-[#111111]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5a5a5a]">{item.copy}</p>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Flow</p>
          <div className="mt-6 space-y-4">
            {[
              "Paste your long URL and optionally choose a custom alias or workspace.",
              "The backend validates the URL, checks alias uniqueness, and stores the link in Postgres.",
              "Every redirect logs device, referrer, country, and visit time before forwarding the visitor.",
              "Authenticated users manage links, expiry settings, analytics, and team collaboration from one dashboard.",
            ].map((step, index) => (
              <div key={step} className="flex gap-4 rounded-3xl border border-black/6 bg-black/[0.02] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-sm font-bold text-white">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-[#4b4b4b]">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-between bg-[#111111] p-6 text-white md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">UI direction</p>
            <h2 className="mt-4 text-3xl font-black">Bright, focused, and product-first.</h2>
            <p className="mt-4 text-sm leading-7 text-white/75">
              The interface uses a warm neutral canvas, one sharp accent color, large rounded cards, and a compact dashboard
              layout that reads clearly on mobile and desktop.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-3xl bg-white/6 p-4 text-sm text-white/90">
            <ArrowRight className="h-4 w-4" />
            Ready for Vercel deployment with Prisma and managed Postgres.
          </div>
        </Card>
      </section>
    </main>
  );
}
