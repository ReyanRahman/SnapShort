import { PrismaClient, TeamRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo12345", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@snapshort.dev" },
    update: {
      name: "Demo User",
      passwordHash,
    },
    create: {
      name: "Demo User",
      email: "demo@snapshort.dev",
      passwordHash,
    },
  });

  let team = await prisma.team.findFirst({
    where: {
      name: "Growth Team",
      ownerId: demoUser.id,
    },
  });

  if (!team) {
    team = await prisma.team.create({
      data: {
        name: "Growth Team",
        ownerId: demoUser.id,
      },
    });
  }

  await prisma.teamMember.upsert({
    where: {
      teamId_userId: {
        teamId: team.id,
        userId: demoUser.id,
      },
    },
    update: {
      role: TeamRole.OWNER,
    },
    create: {
      teamId: team.id,
      userId: demoUser.id,
      role: TeamRole.OWNER,
    },
  });

  const links = [
    {
      slug: "launch-kit",
      originalUrl: "https://example.com/product/launch-kit",
      title: "Launch Kit",
      createdByUserId: demoUser.id,
      teamId: null,
      isActive: true,
    },
    {
      slug: "spring-sale",
      originalUrl: "https://example.com/campaigns/spring-sale",
      title: "Spring Sale Campaign",
      createdByUserId: demoUser.id,
      teamId: team.id,
      isActive: true,
    },
    {
      slug: "team-wiki",
      originalUrl: "https://example.com/internal/wiki",
      title: "Team Wiki",
      createdByUserId: demoUser.id,
      teamId: team.id,
      isActive: true,
    },
  ];

  for (const link of links) {
    await prisma.link.upsert({
      where: { slug: link.slug },
      update: link,
      create: link,
    });
  }

  const storedLinks = await prisma.link.findMany({
    where: {
      slug: { in: links.map((link) => link.slug) },
    },
  });

  for (const link of storedLinks) {
    const alreadySeeded = await prisma.visitEvent.count({
      where: { linkId: link.id },
    });

    if (alreadySeeded > 0) {
      continue;
    }

    await prisma.visitEvent.createMany({
      data: [
        {
          linkId: link.id,
          country: "India",
          city: "Bengaluru",
          deviceType: "Desktop",
          browser: "Chrome",
          os: "Windows",
          referrer: "Direct",
          userAgent: "seeded-demo-agent",
        },
        {
          linkId: link.id,
          country: "India",
          city: "Mumbai",
          deviceType: "Mobile",
          browser: "Safari",
          os: "iOS",
          referrer: "https://twitter.com",
          userAgent: "seeded-demo-agent",
        },
        {
          linkId: link.id,
          country: "United States",
          city: "New York",
          deviceType: "Desktop",
          browser: "Firefox",
          os: "macOS",
          referrer: "https://google.com",
          userAgent: "seeded-demo-agent",
        },
      ],
    });
  }

  console.log("Seed complete.");
  console.log("Demo login: demo@snapshort.dev / demo12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
