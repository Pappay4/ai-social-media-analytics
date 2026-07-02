import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") || "ALL";

    // Jika platform = "ALL", ambil semua analytics dan agregasikan
    if (platform === "ALL") {
      // Ambil semua analytics, grouped per tanggal (melalui socialAccount.platform)
      const allAnalytics = await prisma.analytics.findMany({
        orderBy: { recordedAt: "asc" },
        include: {
          socialAccount: {
            select: { platform: true },
          },
        },
      });

      // Agregasi per tanggal
      const dateMap = new Map<string, {
        date: string;
        followersCount: number;
        engagementRate: number;
        viewsCount: number;
        likesCount: number;
        sharesCount: number;
        count: number;
      }>();

      for (const record of allAnalytics) {
        const dateKey = record.recordedAt.toISOString().split("T")[0];
        const existing = dateMap.get(dateKey);

        if (existing) {
          existing.followersCount += record.followersCount;
          existing.engagementRate += record.engagementRate;
          existing.viewsCount += record.viewsCount;
          existing.likesCount += record.likesCount;
          existing.sharesCount += record.sharesCount;
          existing.count += 1;
        } else {
          dateMap.set(dateKey, {
            date: dateKey,
            followersCount: record.followersCount,
            engagementRate: record.engagementRate,
            viewsCount: record.viewsCount,
            likesCount: record.likesCount,
            sharesCount: record.sharesCount,
            count: 1,
          });
        }
      }

      // Hitung rata-rata engagement rate
      const aggregated = Array.from(dateMap.values()).map((item) => ({
        date: item.date,
        followersCount: item.followersCount,
        engagementRate: Number((item.engagementRate / item.count).toFixed(2)),
        impressions: item.viewsCount, // backward compat
        reach: Math.floor(item.viewsCount * 0.82), // estimated reach
        viewsCount: item.viewsCount,
        likesCount: item.likesCount,
        sharesCount: item.sharesCount,
        platform: "ALL",
      }));

      return NextResponse.json(aggregated);
    }

    // Untuk platform spesifik
    const analytics = await prisma.analytics.findMany({
      where: {
        socialAccount: {
          platform: platform.toUpperCase(),
        },
      },
      orderBy: { recordedAt: "asc" },
      include: {
        socialAccount: {
          select: { platform: true },
        },
      },
    });

    // Transform ke format yang kompatibel dengan frontend
    const formatted = analytics.map((record) => ({
      id: record.id,
      date: record.recordedAt.toISOString().split("T")[0],
      followersCount: record.followersCount,
      engagementRate: record.engagementRate,
      impressions: record.viewsCount,
      reach: Math.floor(record.viewsCount * 0.82),
      viewsCount: record.viewsCount,
      likesCount: record.likesCount,
      sharesCount: record.sharesCount,
      platform: record.socialAccount.platform,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Gagal mengambil data analytics:", error);
    return NextResponse.json({ error: "Gagal mengambil data analytics" }, { status: 500 });
  }
}
