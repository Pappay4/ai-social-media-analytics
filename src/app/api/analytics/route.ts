import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") || "ALL";

    const analytics = await prisma.analytics.findMany({
      where: {
        platform,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error("Gagal mengambil data analytics:", error);
    return NextResponse.json({ error: "Gagal mengambil data analytics" }, { status: 500 });
  }
}
