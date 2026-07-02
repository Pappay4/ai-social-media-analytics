import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Memulai proses seeding database (Issue #5 Schema)...");

  // 1. Bersihkan database lama (urutan: child → parent)
  await prisma.aIInteraction.deleteMany();
  await prisma.analytics.deleteMany();
  await prisma.post.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Data lama berhasil dihapus.");

  // 2. Buat Default User
  const defaultUser = await prisma.user.create({
    data: {
      name: "Alex Marketer",
      email: "alex@socialpilot.ai",
      passwordHash: "$2b$10$placeholder_hash_for_dev_only",
    },
  });
  console.log(`👤 User dibuat: ${defaultUser.name} (${defaultUser.email})`);

  // 3. Buat Akun Sosial Media
  const platformConfigs = [
    { platform: "INSTAGRAM", username: "@alex_instagram", platformUserId: "ig_001" },
    { platform: "LINKEDIN", username: "@alex_linkedin", platformUserId: "li_001" },
    { platform: "TWITTER", username: "@alex_twitter", platformUserId: "tw_001" },
    { platform: "TIKTOK", username: "@alex_tiktok", platformUserId: "tk_001" },
  ];

  const socialAccounts: Record<string, any> = {};
  for (const config of platformConfigs) {
    const account = await prisma.socialAccount.create({
      data: {
        userId: defaultUser.id,
        platform: config.platform,
        username: config.username,
        platformUserId: config.platformUserId,
        accessToken: `mock_oauth_token_${config.platform.toLowerCase()}_${Date.now()}`,
        profilePicUrl: null,
      },
    });
    socialAccounts[config.platform] = account;
  }
  console.log("🌐 Social Accounts berhasil dibuat (4 platform).");

  // 4. Buat Metrik Historis (Analytics) - 15 hari terakhir per akun sosial
  console.log("📊 Seeding data analitik historis...");
  const baseMetrics: Record<string, { followers: number; er: number; views: number; likes: number; shares: number }> = {
    INSTAGRAM: { followers: 5000, er: 4.8, views: 12000, likes: 2400, shares: 480 },
    LINKEDIN: { followers: 2300, er: 3.2, views: 5000, likes: 800, shares: 160 },
    TWITTER: { followers: 8500, er: 2.1, views: 22000, likes: 3300, shares: 1100 },
    TIKTOK: { followers: 12000, er: 8.5, views: 45000, likes: 9000, shares: 4500 },
  };

  const now = new Date();
  for (let i = 14; i >= 0; i--) {
    const recordedAt = new Date(now);
    recordedAt.setDate(now.getDate() - i);

    for (const [platform, base] of Object.entries(baseMetrics)) {
      const dayFactor = 15 - i;
      const fluctuation = Math.sin(dayFactor) * 0.05;
      const followersGrowth = Math.floor(dayFactor * 20);

      await prisma.analytics.create({
        data: {
          socialAccountId: socialAccounts[platform].id,
          recordedAt,
          followersCount: base.followers + followersGrowth,
          engagementRate: Number((base.er + (fluctuation * 10)).toFixed(2)),
          viewsCount: Math.floor(base.views * (1 + fluctuation)),
          likesCount: Math.floor(base.likes * (1 + fluctuation)),
          sharesCount: Math.floor(base.shares * (1 + fluctuation)),
        },
      });
    }
  }
  console.log("📊 60 record analitik historis berhasil di-seed.");

  // 5. Buat Dummy Posts melalui SocialAccount
  console.log("📝 Seeding data posts (Content Planner)...");
  const postsData = [
    {
      socialAccountId: socialAccounts["LINKEDIN"].id,
      hook: "Produktivitas saat ngoding bisa ditingkatkan lho!",
      caption: "Ingin meningkatkan produktivitas saat ngoding? Cobalah teknik Pomodoro dan batasi gangguan notifikasi. Fokus 25 menit, istirahat 5 menit! 🚀",
      callToAction: "Coba terapkan hari ini dan rasakan bedanya!",
      hashtags: JSON.stringify(["#DeveloperTips", "#Productivity", "#CodingLife"]),
      visualDirection: "Infografis minimalis dengan step-by-step flow.",
      status: "PUBLISHED",
      publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      socialAccountId: socialAccounts["INSTAGRAM"].id,
      hook: "Slot komisi bulan ini resmi DIBUKA! ✨",
      caption: "Buat kalian yang butuh ilustrasi karakter untuk avatar atau koleksi pribadi, yuk buruan amankan slot kamu. DM jika berminat! 🎨",
      callToAction: "DM sekarang sebelum slot habis!",
      hashtags: JSON.stringify(["#DigitalArt", "#Commission", "#IllustrationArt"]),
      visualDirection: "Carousel showcase portofolio karya sebelumnya.",
      status: "PUBLISHED",
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      socialAccountId: socialAccounts["TWITTER"].id,
      hook: "Next.js 16 hadir dengan fitur-fitur game-changing! 🔥",
      caption: "Melihat fitur-fitur baru di Next.js 16. Turbopack semakin cepat dan integrasi AI SDK semakin seamless! Apa pendapat kalian?",
      callToAction: "Reply thread ini dengan pendapat kamu! 👇",
      hashtags: JSON.stringify(["#NextJS", "#WebDev", "#ReactJS", "#JavaScript"]),
      visualDirection: "Screenshot fitur baru dengan anotasi highlight.",
      status: "SCHEDULED",
      scheduledAt: new Date(now.getTime() + 12 * 60 * 60 * 1000),
    },
    {
      socialAccountId: socialAccounts["TIKTOK"].id,
      hook: "Proses cepat menggambar karakter Sci-Fi! 🤖🎨",
      caption: "Speedpaint karakter bertema Sci-Fi dengan Clip Studio Paint. Video lengkap segera tayang!",
      callToAction: "Follow untuk konten art process lainnya!",
      hashtags: JSON.stringify(["#Speedpaint", "#SciFiArt", "#AnimeStyle", "#DigitalArt"]),
      visualDirection: "Video timelapse proses gambar 15-30 detik.",
      status: "SCHEDULED",
      scheduledAt: new Date(now.getTime() + 36 * 60 * 60 * 1000),
    },
    {
      socialAccountId: socialAccounts["INSTAGRAM"].id,
      hook: null,
      caption: "Draf ide konten: Perbandingan Shadcn UI vs Tailwind CSS vs Chakra UI untuk proyek Next.js skala menengah.",
      callToAction: null,
      hashtags: JSON.stringify(["#UILibrary", "#FrontendDev", "#WebDesign"]),
      visualDirection: null,
      status: "DRAFT",
    },
  ];

  for (const post of postsData) {
    await prisma.post.create({ data: post });
  }
  console.log("📝 5 posts berhasil di-seed.");

  // 6. Buat Dummy AI Interactions (log audit)
  console.log("🤖 Seeding data AI Interaction logs...");
  const aiInteractions = [
    {
      userId: defaultUser.id,
      actionType: "generate_content",
      promptPayload: JSON.stringify({
        topic: "Tutorial Parallax Scrolling dengan Next.js",
        audience: "Web Developer pemula",
        platform: "LINKEDIN",
      }),
      responsePayload: JSON.stringify({
        status: "success",
        type: "content_draft",
        result: {
          hook: "Website portofolio yang statis sudah membosankan?",
          caption: "Dengan Next.js App Router dan CSS, buat efek parallax yang ringan dan SEO-friendly.",
          call_to_action: "Cek link di komentar!",
          hashtags: ["#WebDev", "#NextJS", "#CSS"],
          visual_direction: "Screen recording 15 detik.",
        },
      }),
    },
    {
      userId: defaultUser.id,
      actionType: "analyze_metrics",
      promptPayload: JSON.stringify({
        metrics_data: {
          week: "Minggu ke-2",
          total_posts: 4,
          avg_engagement_rate: "4.2%",
        },
      }),
      responsePayload: JSON.stringify({
        status: "success",
        type: "data_insight",
        result: {
          performance_summary: "Konten visual mengungguli konten teks biasa sebesar 80%.",
          strengths: ["Followers tumbuh 4.2% dalam seminggu."],
          areas_of_improvement: ["Engagement rate Twitter menurun 1.2%."],
          next_strategy: "Geser jadwal posting ke jam 18:00 - 19:30.",
        },
      }),
    },
    {
      userId: defaultUser.id,
      actionType: "sentiment_analysis",
      promptPayload: JSON.stringify({
        comments: [
          "Kapan buka slot komisi lagi min?",
          "Tips Next.js nya ngebantu banget!",
          "Harganya kemahalan sih menurut saya.",
        ],
      }),
      responsePayload: JSON.stringify({
        status: "success",
        type: "sentiment_analysis",
        result: {
          sentiment: "Positive",
          score: "82%",
          summary: "Mayoritas audiens positif, ada sedikit kritik harga.",
          key_comments: ["Kapan buka slot komisi lagi min?"],
        },
      }),
    },
  ];

  for (const interaction of aiInteractions) {
    await prisma.aIInteraction.create({ data: interaction });
  }
  console.log("🤖 3 AI Interaction logs berhasil di-seed.");

  console.log("\n✅ Proses seeding database Issue #5 berhasil diselesaikan! 🎉");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
