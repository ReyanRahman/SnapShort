import { NextResponse } from "next/server";

import { getVisitMetadata } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { hashIp, isReservedSlug } from "@/lib/urls";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const normalizedSlug = slug.toLowerCase();

  if (isReservedSlug(normalizedSlug)) {
    return new Response("Not found", { status: 404 });
  }

  const link = await prisma.link.findUnique({
    where: { slug: normalizedSlug },
  });

  if (!link || link.isArchived) {
    return new Response("Not found", { status: 404 });
  }

  if (!link.isActive || (link.expiresAt && link.expiresAt < new Date())) {
    return new Response("This link is inactive or expired.", { status: 410 });
  }

  const metadata = await getVisitMetadata();

  await prisma.visitEvent.create({
    data: {
      linkId: link.id,
      ipHash: hashIp(metadata.ip),
      country: metadata.country,
      city: metadata.city,
      deviceType: metadata.deviceType,
      browser: metadata.browser,
      os: metadata.os,
      referrer: metadata.referrer,
      userAgent: metadata.userAgent,
    },
  });

  return NextResponse.redirect(link.originalUrl, { status: 307 });
}
