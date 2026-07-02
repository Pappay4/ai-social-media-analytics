/**
 * Next.js API Route - AI Social Media Generator
 * 
 * File ini bertindak sebagai API endpoint (POST /api/generate) untuk memproses
 * input pengguna dan mengirimkannya ke Google Gemini API.
 * 
 * Didesain secara profesional namun mudah dipelajari oleh developer junior:
 * 1. Tanpa dependensi eksternal berat (menggunakan fetch API bawaan).
 * 2. Menggunakan fallback simulasi jika API Key tidak diset.
 * 3. Dilengkapi penanganan error yang kuat (robust error handling & parsing).
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Ekstraksi Data dari Request Body
    const data = await request.json();
    const { topic, targetAudience, tone, platform, historicalBestTime } = data;

    // 2. Validasi Input (Memastikan parameter wajib sudah terisi)
    if (!topic || !targetAudience || !tone || !platform) {
      return NextResponse.json(
        { status: "error", message: "Parameter wajib (topic, targetAudience, tone, platform) tidak boleh kosong." },
        { status: 400 } // Bad Request
      );
    }

    // 3. Memeriksa API Key Gemini di Environment Variable (.env / .env.local)
    const apiKey = process.env.GEMINI_API_KEY;

    // --- SYSTEM INSTRUCTION (Persona & Batasan AI) ---
    // Di sinilah kita mendefinisikan peran AI (Persona), batasan, dan format wajib JSON.
    const systemInstruction = `
Kamu adalah AI Social Media Expert & Data Analyst kelas dunia. Tugas utamamu adalah membantu pengguna merencanakan konten media sosial yang menarik, mengoptimalkan SEO/Hashtag, dan memberikan rekomendasi strategi berdasarkan data performa historis. Kamu memiliki nada bicara yang profesional, kreatif, dan berorientasi pada data (data-driven).

Objectives:
- Menganalisis input pengguna (topik, audiens target, tone bahasa) untuk menghasilkan draf takarir (caption) yang siap unggah.
- Mengidentifikasi kata kunci (SEO) dan tagar (hashtags) yang paling relevan untuk meningkatkan jangkauan organik.
- Memberikan rekomendasi jenis visual (gambar/video) yang paling cocok dengan teks konten.
- Mengembalikan output secara ketat dalam format JSON agar dapat diproses oleh sistem aplikasi.

Rules & Constraints:
1. Dilarang Halusinasi Data: Jika data historis tidak diberikan, berikan rekomendasi waktu unggah standar industri (misal: 18:00 - 20:00).
2. Kesesuaian Platform:
   - Jika platform adalah LinkedIn, gunakan bahasa yang lebih terstruktur dan profesional.
   - Jika platform adalah Instagram atau TikTok, gunakan emoji yang relevan, bahasa yang lebih dinamis, dan visual yang kuat.
3. Strict JSON: Jangan pernah menambahkan sapaan seperti "Tentu, ini hasilnya" sebelum JSON, atau penjelasan setelah JSON. Kamu WAJIB membalas hanya dengan format JSON yang valid tanpa teks tambahan di luar JSON.

Output Data Schema:
{
  "status": "success",
  "content": {
    "hook": "Kalimat pembuka yang memancing perhatian (max 2 kalimat)",
    "body": "Isi utama dari caption yang detail dan sesuai tone",
    "callToAction": "Kalimat ajakan bertindak (CTA)",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "visualRecommendation": "Deskripsi singkat tentang gambar atau video yang harus dibuat untuk melengkapi caption ini",
  "recommendedPostingTime": "Rekomendasi jam tayang berdasarkan 'historicalBestTime' dan analisis audiens"
}
`;

    // --- USER PROMPT & FEW-SHOT PROMPTING ---
    // Few-Shot Prompting adalah teknik memberikan contoh input-output agar AI
    // memahami struktur format balasan yang diinginkan secara presisi.
    const userPrompt = `
Gunakan Example Interaction berikut sebagai referensi Few-Shot:

Example Input:
{
  "topic": "Membuka slot komisi (open commission) untuk ilustrasi karakter digital",
  "targetAudience": "Penggemar game RPG, kolektor seni, dan komunitas anime",
  "tone": "Santai, antusias, dan bersahabat",
  "platform": "Instagram",
  "historicalBestTime": "Jumat malam, 19:30"
}

Example Output:
{
  "status": "success",
  "content": {
    "hook": "Karakter original (OC) kamu cuma numpuk di kepala? Sini, biar aku yang wujudkan ke kanvas digital! ✨🎨",
    "body": "Slot komisi bulan ini resmi DIBUKA! Buat kalian yang butuh ilustrasi karakter untuk avatar, kampanye D&D, atau sekadar koleksi pribadi, aku siap bantu. Slot sangat terbatas (hanya 5 orang bulan ini), jadi pastikan kamu booking sebelum kehabisan. Cek sorotan (highlight) untuk melihat daftar harga dan Terms of Service ya!",
    "callToAction": "Klik link di bio untuk amankan slot kamu, atau DM kalau mau diskusi konsep dulu! 👇",
    "hashtags": ["#DigitalArtCommission", "#OpenCommission", "#CharacterDesign", "#AnimeArtStyle", "#RPGCharacter"]
  },
  "visualRecommendation": "Carousel post (slide). Slide 1: Artwork terbaikmu dengan tulisan 'OPEN COMMISSION' besar dan estetik. Slide 2-4: Contoh hasil ilustrasi (Headshot, Half Body, Full Body). Slide 5: Tabel harga singkat.",
  "recommendedPostingTime": "Jumat, 19:30 (Sesuai dengan metrik historismu, ini waktu saat komunitas sedang santai menyambut akhir pekan)"
}

Input Pengguna Yang Harus Diproses:
${JSON.stringify({ topic, targetAudience, tone, platform, historicalBestTime }, null, 2)}
`;

    // 4. Fallback Simulasi (Mock Mode)
    // Jika API Key tidak diset, server tidak akan crash. Ia akan mengembalikan data simulasi
    // yang realistis setelah jeda buatan (artifisial) selama 1.5 detik.
    if (!apiKey) {
      console.warn("GEMINI_API_KEY tidak ditemukan. Aplikasi berjalan dalam mode Simulasi (Mock Generator).");
      
      // Jeda 1.5 detik untuk mensimulasikan waktu pemrosesan jaringan
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResponse = generateMockResponse(topic, targetAudience, tone, platform, historicalBestTime);
      return NextResponse.json(mockResponse);
    }

    // 5. Pemanggilan Direct API Gemini (Google Generative AI REST API)
    // Menggunakan POST request langsung ke endpoint API Gemini 2.5 Flash.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userPrompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            responseMimeType: "application/json", // Memaksa Gemini membalas dalam format JSON terstruktur
          },
        }),
      }
    );

    // Menangani error HTTP response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: Status ${response.status} - ${errorText}`);
    }

    const resJson = await response.json();
    const responseText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // 6. Parsing dan Pembersihan Output JSON
    try {
      const parsed = JSON.parse(responseText.trim());
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Format balasan AI bukan JSON murni, mencoba membersihkan block markdown:", responseText, parseError);
      
      // Mengatasi kasus jika AI membungkus JSON dalam block markdown (```json ... ```)
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedClean = JSON.parse(jsonMatch[1].trim());
          return NextResponse.json(parsedClean);
        } catch (e) {
          // Gagal juga saat parsing block markdown
        }
      }

      return NextResponse.json(
        {
          status: "error",
          message: "Gagal memproses struktur balasan dari AI.",
          rawResponse: responseText,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Terjadi kesalahan pada Server Route:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Kesalahan internal server." },
      { status: 500 }
    );
  }
}

/**
 * Generator Mock Response
 * 
 * Fungsi utilitas untuk menghasilkan data tiruan berkualitas tinggi
 * yang disesuaikan dengan platform dan tone pilihan pengguna.
 */
function generateMockResponse(
  topic: string,
  targetAudience: string,
  tone: string,
  platform: string,
  historicalBestTime: string
) {
  const hashtags = [
    `#${platform}Marketing`,
    `#${tone.replace(/\s+/g, "")}Style`,
    `#SocialMediaCoPilot`,
    "#AIContent",
    "#OrganicReach",
  ];

  let hook = "";
  let body = "";
  let cta = "";
  let visual = "";
  let postingTime = historicalBestTime || "18:00 - 20:00 (Standard Industri)";

  if (platform.toLowerCase() === "linkedin") {
    hook = `Apakah Anda sedang mencari cara terbaik untuk mengatasi tantangan terkait "${topic}"?`;
    body = `Dalam lingkungan profesional yang terus berkembang, memahami kebutuhan ${targetAudience} adalah kunci utama. Melalui pendekatan yang bernada ${tone}, kita dapat membangun sinergi yang berkelanjutan. Mari diskusikan bagaimana langkah strategis ini dapat diimplementasikan secara efisien.`;
    cta = "Bagikan pandangan Anda di kolom komentar di bawah ini!";
    visual = "Grafik data analitik bersih dengan skema warna korporat modern (cool blue/navy) atau dokumen PDF infografis 3 slide.";
  } else {
    hook = `Yuk bahas soal ${topic}! Buat kamu yang sering ngerasa relate, postingan ini pas banget buat kamu! 🔥✨`;
    body = `Khusus buat ${targetAudience}, postingan dengan gaya ${tone} ini dibuat biar kita bisa lebih paham cara optimalkannya. Jangan lewatkan tips-tips keren yang bisa langsung kamu praktekkin sekarang juga!`;
    cta = "Tag teman kamu yang butuh info ini, dan jangan lupa save biar gak hilang ya! 👇";
    visual = "Carousel post (slide 1: Headline tebal dengan latar belakang gradient estetik. Slide 2-3: Poin-poin penting. Slide 4: CTA Call-To-Action grafis).";
  }

  return {
    status: "success",
    content: {
      hook,
      body,
      callToAction: cta,
      hashtags,
    },
    visualRecommendation: visual,
    recommendedPostingTime: postingTime,
  };
}
