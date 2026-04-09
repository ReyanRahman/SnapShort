import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { buildAnalyticsSummary, getLinkForUser } from "@/lib/data";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const link = await getLinkForUser(id, session.user.id);

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json(buildAnalyticsSummary(link.visits));
}
