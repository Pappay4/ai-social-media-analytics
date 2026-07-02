import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/ai-interactions
 * Mengambil riwayat log interaksi AI untuk audit trail.
 * Query params:
 *   - limit: Jumlah maksimal log (default: 20)
 *   - action_type: Filter berdasarkan action type (optional)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const actionType = searchParams.get("action_type");

    const where: any = {};
    if (actionType) {
      where.actionType = actionType;
    }

    const interactions = await prisma.aIInteraction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Parse JSON payloads sebelum mengirim ke client
    const parsed = interactions.map((interaction) => ({
      ...interaction,
      promptPayload: (() => {
        try { return JSON.parse(interaction.promptPayload); } catch { return interaction.promptPayload; }
      })(),
      responsePayload: (() => {
        try { return JSON.parse(interaction.responsePayload); } catch { return interaction.responsePayload; }
      })(),
    }));

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Gagal mengambil data AI interactions:", error);
    return NextResponse.json({ error: "Gagal mengambil data AI interactions" }, { status: 500 });
  }
}
