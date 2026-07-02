import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding database...");

  // 1. Bersihkan database lama (Clean up)
  await prisma.analytics.deleteMany();
  await prisma.post.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat Default User
  const defaultUser = await prisma.user.create({
    data: {
      name: "Alex Marketer",
      email: "alex@socialpilot.ai",
    },
  });

  console.log(`User dibuat: ${defaultUser.name} (${defaultUser.email})`);

  // 3. Buat Akun Sosial Media
  const platforms = ["Instagram", "LinkedIn", "Twitter", "TikTok"];
  for (const platform of platforms) {
    await prisma.socialAccount.create({
      data: {
        platform,
        username: `@alex_${platform.toLowerCase()}`,
        userId: defaultUser.id,
      },
    });
  }
  console.log("Social Accounts berhasil dibuat.");

  // 4. Buat Metrik Historis (Analytics) - 15 hari terakhir
  console.log("Seeding data analitik historis...");
  const baseMetrics: Record<string, { followers: number; er: number; imp: number; reach: number }> = {
    Instagram: { followers: 5000, er: 4.8, imp: 12000, reach: 9500 },
    LinkedIn: { followers: 2300, er: 3.2, imp: 5000, reach: 4100 },
    Twitter: { followers: 8500, er: 2.1, imp: 22000, reach: 18000 },
    TikTok: { followers: 12000, er: 8.5, imp: 45000, reach: 38000 },
    ALL: { followers: 27800, er: 4.65, imp: 84000, reach: 69600 },
  };

  const now = new Date();
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    for (const platform of [...platforms, "ALL"]) {
      const base = baseMetrics[platform];
      // Tambahkan fluktuasi acak yang realistis
      const dayFactor = 15 - i;
      const fluctuation = Math.sin(dayFactor) * 0.05;
      const followersGrowth = Math.floor(dayFactor * (platform === "ALL" ? 80 : 20));

      await prisma.analytics.create({
        data: {
          date,
          platform,
          followersCount: base.followers + followersGrowth,
          engagementRate: Number((base.er + (fluctuation * 10)).toFixed(2)),
          impressions: Math.floor(base.imp * (1 + fluctuation)),
          reach: Math.floor(base.reach * (1 + fluctuation)),
          userId: defaultUser.id,
        },
      });
    }
  }

  // 5. Buat Dummy Posts (Draft, Scheduled, Published)
  console.log("Seeding data posts (Content Planner)...");
  const postsData = [
    {
      title: "Tips Produktivitas Developer",
      content: "Ingin meningkatkan produktivitas saat ngoding? Cobalah teknik Pomodoro dan batasi gangguan notifikasi. Fokus 25 menit, istirahat 5 menit! 🚀 #DeveloperTips #Productivity #CodingLife",
      status: "PUBLISHED",
      platform: "LinkedIn",
      publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Kemarin
    },
    {
      title: "Pengumuman Open Commission",
      content: "Slot komisi bulan ini resmi DIBUKA! Buat kalian yang butuh ilustrasi karakter untuk avatar atau koleksi pribadi, yuk buruan amankan slot kamu. DM jika berminat! ✨🎨 #DigitalArt #Commission",
      status: "PUBLISHED",
      platform: "Instagram",
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 hari lalu
    },
    {
      title: "Next.js 16 Preview",
      content: "Melihat fitur-fitur baru di Next.js 16. Turbopack semakin cepat dan integrasi AI SDK semakin seamless! Apa pendapat kalian? 👇 #NextJS #WebDev #ReactJS",
      status: "SCHEDULED",
      platform: "Twitter",
      scheduledAt: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 jam lagi
    },
    {
      title: "Behind The Scenes Speedpaint",
      content: "Proses cepat menggambar karakter bertema Sci-Fi dengan Clip Studio Paint. Video lengkap segera tayang! 🤖🎨 #Speedpaint #SciFiArt #AnimeStyle",
      status: "SCHEDULED",
      platform: "TikTok",
      scheduledAt: new Date(now.getTime() + 36 * 60 * 60 * 1000), // Besok lusa
    },
    {
      title: "Tips Memilih UI Library",
      content: "Draf ide konten: Perbandingan Shadcn UI vs Tailwind CSS vs Chakra UI untuk proyek Next.js skala menengah.",
      status: "DRAFT",
      platform: "Instagram",
    },
  ];

  for (const post of postsData) {
    await prisma.post.create({
      data: {
        ...post,
        userId: defaultUser.id,
      },
    });
  }

  console.log("Proses seeding database berhasil diselesaikan! 🎉");
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
