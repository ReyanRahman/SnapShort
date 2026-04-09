import { addDays, differenceInDays, format } from "date-fns";
import { TeamRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getUserDashboardData(userId: string) {
  const [links, memberships] = await Promise.all([
    prisma.link.findMany({
      where: {
        isArchived: false,
        OR: [
          { createdByUserId: userId },
          {
            team: {
              members: {
                some: { userId },
              },
            },
          },
        ],
      },
      include: {
        team: {
          select: { id: true, name: true },
        },
        visits: {
          select: { id: true, visitedAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        team: { createdAt: "asc" },
      },
    }),
  ]);

  const now = new Date();

  const stats = {
    totalLinks: links.length,
    totalClicks: links.reduce((total, link) => total + link.visits.length, 0),
    activeLinks: links.filter((link) => link.isActive && (!link.expiresAt || link.expiresAt > now)).length,
    expiringSoon: links.filter((link) => link.expiresAt && differenceInDays(link.expiresAt, now) <= 7).length,
  };

  return {
    links,
    memberships,
    stats,
  };
}

export async function getLinkForUser(linkId: string, userId: string) {
  return prisma.link.findFirst({
    where: {
      id: linkId,
      isArchived: false,
      OR: [
        { createdByUserId: userId },
        {
          team: {
            members: {
              some: { userId },
            },
          },
        },
      ],
    },
    include: {
      team: true,
      visits: {
        orderBy: { visitedAt: "desc" },
      },
    },
  });
}

export async function getTeamForUser(teamId: string, userId: string) {
  return prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      invites: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      },
      links: {
        where: { isArchived: false },
        include: {
          visits: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export function buildAnalyticsSummary(
  visits: Array<{
    visitedAt: Date;
    country: string | null;
    referrer: string | null;
    deviceType: string | null;
    browser: string | null;
    os: string | null;
  }>,
) {
  const clicksByDay = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(new Date(), index - 6);
    const key = format(date, "MMM d");
    const clicks = visits.filter((visit) => format(visit.visitedAt, "MMM d") === key).length;
    return { date: key, clicks };
  });

  const topCountries = groupValues(visits.map((visit) => visit.country || "Unknown"));
  const topReferrers = groupValues(visits.map((visit) => visit.referrer || "Direct"));
  const topDevices = groupValues(visits.map((visit) => visit.deviceType || "Unknown"));
  const topBrowsers = groupValues(visits.map((visit) => visit.browser || "Unknown"));
  const topOs = groupValues(visits.map((visit) => visit.os || "Unknown"));

  return {
    totalClicks: visits.length,
    clicksByDay,
    topCountries,
    topReferrers,
    topDevices,
    topBrowsers,
    topOs,
    recentVisits: visits.slice(0, 10),
  };
}

export async function getUserRoleForTeam(teamId: string, userId: string) {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
    select: { role: true },
  });

  return membership?.role ?? null;
}

export function canEditRole(role: TeamRole | null) {
  return role === TeamRole.OWNER || role === TeamRole.EDITOR;
}

function groupValues(values: string[]) {
  return Object.entries(
    values.reduce<Record<string, number>>((accumulator, value) => {
      accumulator[value] = (accumulator[value] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
