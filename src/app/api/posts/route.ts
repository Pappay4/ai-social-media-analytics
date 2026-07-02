import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ambil semua posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Gagal mengambil data posts:", error);
    return NextResponse.json({ error: "Gagal mengambil data posts" }, { status: 500 });
  }
}

// Buat post baru
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, content, status, platform, scheduledAt, publishedAt } = data;

    if (!title || !content || !status || !platform) {
      return NextResponse.json({ error: "Parameter wajib tidak lengkap" }, { status: 400 });
    }

    // Ambil user pertama sebagai default
    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          name: "Alex Marketer",
          email: "alex@socialpilot.ai",
        },
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        status,
        platform,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        userId: defaultUser.id,
      },
    });

    return NextResponse.json(newPost);
  } catch (error: any) {
    console.error("Gagal membuat post baru:", error);
    return NextResponse.json({ error: "Gagal membuat post baru: " + error.message }, { status: 500 });
  }
}
