import { prisma } from "./prisma";

/**
 * Rolls up a user's recent events into weighted interest scores per
 * (partType) and (phoneBrand). Call this from a scheduled job (e.g. a
 * Vercel Cron hitting /api/cron/score-interests) or incrementally after
 * each event — see docs section 14.2.
 */
export async function recomputeUserInterests(userId: string) {
  const events = await prisma.userEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  const scores = new Map<string, number>();
  const now = Date.now();

  for (const e of events) {
    const ageDays = (now - e.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const weight = Math.exp(-ageDays / 14); // ~2-week half-life
    const bump = e.eventType === "VIEW" ? 1 : 0.5;

    if (e.partType) {
      const key = `part:${e.partType}`;
      scores.set(key, (scores.get(key) ?? 0) + weight * bump);
    }
    if (e.phoneBrand) {
      const key = `brand:${e.phoneBrand}`;
      scores.set(key, (scores.get(key) ?? 0) + weight * bump);
    }
  }

  for (const [key, score] of scores.entries()) {
    const [kind, value] = key.split(":");
    await prisma.userInterest.upsert({
      where: {
        userId_partType_phoneBrand: {
          userId,
          partType: kind === "part" ? value : null,
          phoneBrand: kind === "brand" ? value : null
        }
      },
      create: {
        userId,
        partType: kind === "part" ? value : null,
        phoneBrand: kind === "brand" ? value : null,
        score
      },
      update: { score }
    });
  }
}

/** Returns the user's top N interests, highest score first. */
export async function getTopInterests(userId: string, limit = 5) {
  return prisma.userInterest.findMany({
    where: { userId },
    orderBy: { score: "desc" },
    take: limit
  });
}
