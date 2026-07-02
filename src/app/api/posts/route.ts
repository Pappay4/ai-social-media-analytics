import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ambil semua posts (dengan info social account)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        socialAccount: {
          select: {
            platform: true,
            username: true,
          },
        },
      },
    });

    // Parse hashtags dari JSON string dan sertakan platform dari socialAccount
    const enrichedPosts = posts.map((post) => ({
      ...post,
      platform: post.socialAccount.platform,
      hashtags: (() => {
        try {
          return JSON.parse(post.hashtags);
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json(enrichedPosts);
  } catch (error: any) {
    console.error("Gagal mengambil data posts:", error);
    return NextResponse.json({ error: "Gagal mengambil data posts" }, { status: 500 });
  }
}

// Buat post baru
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { caption, hook, callToAction, hashtags, visualDirection, status, platform, scheduledAt, publishedAt } = data;

    if (!caption || !status || !platform) {
      return NextResponse.json({ error: "Parameter wajib tidak lengkap (caption, status, platform)" }, { status: 400 });
    }

    // Cari social account yang sesuai platform, atau buat user & account default
    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          name: "Alex Marketer",
          email: "alex@socialpilot.ai",
          passwordHash: "",
        },
      });
    }

    let socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: defaultUser.id,
        platform: platform.toUpperCase(),
      },
    });

    if (!socialAccount) {
      socialAccount = await prisma.socialAccount.create({
        data: {
          userId: defaultUser.id,
          platform: platform.toUpperCase(),
          username: `@user_${platform.toLowerCase()}`,
          accessToken: "",
        },
      });
    }

    const newPost = await prisma.post.create({
      data: {
        socialAccountId: socialAccount.id,
        caption,
        hook: hook || null,
        callToAction: callToAction || null,
        hashtags: Array.isArray(hashtags) ? JSON.stringify(hashtags) : (hashtags || "[]"),
        visualDirection: visualDirection || null,
        status: status.toUpperCase(),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    return NextResponse.json(newPost);
  } catch (error: any) {
    console.error("Gagal membuat post baru:", error);
    return NextResponse.json({ error: "Gagal membuat post baru: " + error.message }, { status: 500 });
  }
}
