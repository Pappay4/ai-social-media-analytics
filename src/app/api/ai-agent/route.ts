/**
 * Next.js API Route - Multi-Task AI Agent
 * 
 * Endpoint ini (POST /api/ai-agent) mengimplementasikan prompt terpusat (agent.md.md)
 * untuk menangani tiga jenis aksi:
 * 1. generate_content: Menghasilkan caption, hashtag, & visual.
 * 2. analyze_metrics: Meringkas performa analitik mingguan.
 * 3. sentiment_analysis: Menganalisis sentimen pada komentar audiens.
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { action_type, data_payload } = data;

    // 1. Validasi Input Dasar
    if (!action_type || !data_payload) {
      return NextResponse.json(
        { status: "error", message: "Parameter 'action_type' dan 'data_payload' wajib diisi." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // --- SYSTEM INSTRUCTION (Persona & Skema Output Strict JSON) ---
    const systemInstruction = `
Kamu adalah AI Social Media Expert & Data Analyst kelas dunia. Tugas utamamu adalah membantu pengguna merencanakan konten media sosial yang menarik, mengoptimalkan SEO/Hashtag, memberikan rekomendasi strategi berdasarkan data performa historis, serta menganalisa komentar. Kamu memiliki nada bicara yang profesional, kreatif, dan berorientasi pada data (data-driven).

Objectives:
- Mengembalikan output secara ketat dalam format JSON yang valid berdasarkan action_type yang diminta tanpa teks tambahan di luar JSON.

Output Data Schema & Rules:
1. Jika action_type == "generate_content"
{
  "status": "success",
  "type": "content_draft",
  "result": {
    "hook": "Kalimat pancingan (max 2 kalimat)",
    "caption": "Isi detail konten",
    "call_to_action": "Kalimat ajakan",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "visual_direction": "Rekomendasi UI/Visual"
  }
}

2. Jika action_type == "analyze_metrics"
{
  "status": "success",
  "type": "data_insight",
  "result": {
    "performance_summary": "Satu paragraf kesimpulan dari angka-angka metrik",
    "strengths": ["Poin kuat 1", "Poin kuat 2"],
    "areas_of_improvement": ["Kelemahan 1", "Kelemahan 2"],
    "next_strategy": "Saran konkret untuk strategi minggu depan"
  }
}

3. Jika action_type == "sentiment_analysis"
{
  "status": "success",
  "type": "sentiment_analysis",
  "result": {
    "sentiment": "Positive / Negative / Neutral",
    "score": "Persentase sentimen positif (misal: 85%)",
    "summary": "Ringkasan sentimen dari seluruh komentar",
    "key_comments": ["Komentar kunci 1", "Komentar kunci 2"]
  }
}

Strict Constraints:
- JANGAN PERNAH memberikan respons berupa Markdown text biasa. Kamu adalah API endpoint.
- Selalu patuhi struktur objek JSON berdasarkan action_type.
- Jika data_payload kosong atau tidak valid, kembalikan JSON dengan "status": "error" dan pesan error di field "message".
`;

    // --- FEW-SHOT EXAMPLES ---
    const userPrompt = `
Gunakan Example Interaction berikut sebagai referensi Few-Shot:

[Contoh generate_content]
Input:
{
  "action_type": "generate_content",
  "data_payload": {
    "topic": "Tutorial membuat efek Parallax Scrolling dengan Next.js dan CSS",
    "audience": "Web Developer pemula hingga menengah",
    "platform": "LinkedIn"
  }
}
Output:
{
  "status": "success",
  "type": "content_draft",
  "result": {
    "hook": "Website portofolio yang statis sudah mulai membosankan? Saatnya tingkatkan User Experience (UX) dengan efek Parallax Scrolling! 🚀",
    "caption": "Banyak yang mengira membuat efek parallax membutuhkan library pihak ketiga yang berat. Padahal, dengan kombinasi Next.js (App Router) dan manipulasi CSS dasar, kita bisa membuat efek visual yang dinamis, ringan, dan tetap SEO-friendly. Efek kedalaman visual ini sangat efektif untuk menahan pengunjung lebih lama di halaman website Anda.",
    "call_to_action": "Saya baru saja menulis panduan langkah-demi-langkah beserta snippet kodenya. Cek link di kolom komentar untuk membaca selengkapnya, dan bagikan pendapat Anda!",
    "hashtags": ["#WebDevelopment", "#Nextjs", "#FrontendDev", "#CSS", "#WebDesign"],
    "visual_direction": "Video screen-recording berdurasi 15 detik yang menampilkan website portofolio saat di-scroll, menyorot elemen gambar dan teks yang bergerak dengan kecepatan berbeda."
  }
}

[Contoh analyze_metrics]
Input:
{
  "action_type": "analyze_metrics",
  "data_payload": {
    "metrics_data": {
      "week": "Minggu ke-2",
      "total_posts": 4,
      "avg_engagement_rate": "4.2%",
      "top_performing_post_topic": "Video proses pembuatan ilustrasi digital (Speedpaint)",
      "lowest_performing_post_topic": "Teks promosi harga komisi"
    }
  }
}
Output:
{
  "status": "success",
  "type": "data_insight",
  "result": {
    "performance_summary": "Performa minggu ke-2 menunjukkan bahwa audiens sangat merespons konten visual yang bersifat proses di balik layar (behind the scenes) dibandingkan konten promosi penjualan langsung yang cenderung diabaikan.",
    "strengths": [
      "Engagement rate 4.2% tergolong sehat dan di atas rata-rata industri",
      "Konten video edukasi/proses kreatif memiliki daya tarik retensi yang tinggi"
    ],
    "areas_of_improvement": [
      "Konten promosi/penjualan (hard-selling) menurunkan tingkat interaksi secara signifikan"
    ],
    "next_strategy": "Terapkan metode 'Soft-Selling'. Alih-alih membuat post yang hanya berisi daftar harga, buatlah konten video speedpaint (proses pembuatan seni digital) dan selipkan informasi bahwa komisi sedang dibuka."
  }
}

Input Pengguna Yang Harus Diproses:
{
  "action_type": "${action_type}",
  "data_payload": ${JSON.stringify(data_payload, null, 2)}
}
`;

    // 2. Fallback Simulasi (Mock Mode) jika tidak ada API key
    if (!apiKey) {
      console.warn("GEMINI_API_KEY tidak ditemukan. Menjalankan fallback simulator.");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulasi delay
      const mockResponse = generateMockResponse(action_type, data_payload);

      // Log AI interaction ke database (audit trail)
      await logAIInteraction(action_type, data_payload, mockResponse);

      return NextResponse.json(mockResponse);
    }

    // 3. Panggil Gemini API menggunakan SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    try {
      const parsed = JSON.parse(responseText.trim());
      // Log AI interaction ke database (audit trail)
      await logAIInteraction(action_type, data_payload, parsed);
      return NextResponse.json(parsed);
    } catch (parseError) {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedClean = JSON.parse(jsonMatch[1].trim());
          // Log AI interaction ke database (audit trail)
          await logAIInteraction(action_type, data_payload, parsedClean);
          return NextResponse.json(parsedClean);
        } catch (e) {}
      }
      return NextResponse.json(
        { status: "error", message: "Gagal memparsing output JSON dari AI." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Terjadi error di API /api/ai-agent:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Log setiap interaksi AI ke tabel AIInteraction untuk audit trail.
 */
async function logAIInteraction(actionType: string, promptPayload: any, responsePayload: any) {
  try {
    const defaultUser = await prisma.user.findFirst();
    if (defaultUser) {
      await prisma.aIInteraction.create({
        data: {
          userId: defaultUser.id,
          actionType,
          promptPayload: JSON.stringify(promptPayload),
          responsePayload: JSON.stringify(responsePayload),
        },
      });
    }
  } catch (logError) {
    console.error("Gagal menyimpan log AI Interaction:", logError);
    // Jangan throw error logging, biarkan response tetap dikirim ke client
  }
}

/**
 * Generator Mock Response untuk AI Agent
 */
function generateMockResponse(action_type: string, data_payload: any) {
  if (action_type === "generate_content") {
    const { topic, audience, platform } = data_payload;
    return {
      status: "success",
      type: "content_draft",
      result: {
        hook: `Bosan dengan konten ${topic} yang biasa-biasa saja? Nih, trik rahasia buat kamu! ✨`,
        caption: `Halo para ${audience || "kreator"}! Hari ini kita mau bedah tuntas cara optimalisasi ${topic} di platform ${platform || "Instagram"}. Ini penting banget buat kelangsungan brand kamu.`,
        call_to_action: "Yuk komen di bawah kalau kamu punya pengalaman menarik seputar topik ini! 👇",
        hashtags: [`#${platform || "Media"}Tips`, `#${topic.replace(/\s+/g, "")}`, "#SocialPilot"],
        visual_direction: "Carousel grafis dengan judul tebal dan mockup interaktif berwarna ungu kontras.",
      },
    };
  }

  if (action_type === "analyze_metrics") {
    return {
      status: "success",
      type: "data_insight",
      result: {
        performance_summary: "Secara keseluruhan, postingan visual berbasis video mengungguli postingan teks biasa sebesar 80% dalam hal impresi dan interaksi di semua saluran media sosial.",
        strengths: [
          "Followers tumbuh sebesar 4.2% dalam seminggu terakhir.",
          "Postingan video kreatif mendapat jangkauan organik terbaik."
        ],
        areas_of_improvement: [
          "Engagement rate pada platform Twitter/X menurun 1.2% karena jarangnya postingan interaktif.",
          "Jadwal posting di pagi hari cenderung memiliki reach yang lebih rendah."
        ],
        next_strategy: "Geser jadwal posting utama ke jam 18:00 - 19:30, dan ubah strategi promosi hard-selling menjadi soft-selling melalui review produk atau tutorial interaktif."
      },
    };
  }

  if (action_type === "sentiment_analysis") {
    return {
      status: "success",
      type: "sentiment_analysis",
      result: {
        sentiment: "Positive",
        score: "87%",
        summary: "Mayoritas audiens merasa terbantu dan sangat menyukai tips praktis yang dibagikan. Ada ketertarikan tinggi terhadap pembukaan komisi gambar digital.",
        key_comments: [
          "Kapan buka slot komisi lagi min? Mau pesan buat karakter game saya!",
          "Tips Next.js nya ngebantu banget bang, ditunggu lanjutannya."
        ]
      },
    };
  }

  return {
    status: "error",
    message: "Aksi tidak dikenali.",
  };
}
