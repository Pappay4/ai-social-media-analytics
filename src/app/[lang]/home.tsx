"use client";

/**
 * Dashboard UI Component - AI Social Media Co-Pilot
 * 
 * File ini mengatur seluruh tampilan antarmuka (Frontend) pengguna menggunakan React & Tailwind CSS.
 * Didesain 100% bebas dari library ikon eksternal (menggunakan inline SVG) agar aman dan stabil
 * saat dideploy tanpa resiko conflict node_modules.
 * 
 * Target Pembelajaran untuk Junior Developer:
 * 1. State Management: Menggunakan `useState` untuk melacak input formulir dan respon AI.
 * 2. API Communication: Fetching data secara asynchronous ke `/api/generate` lokal.
 * 3. Conditional Rendering: Menampilkan spinner/loading state dan hasil konten yang di-generate.
 * 4. Responsive & Modern Layout: Grid system, flexbox, glassmorphic styling, dan visualisasi chart SVG murni.
 */

import React, { useState } from "react";

// ==========================================
// 1. INLINE SVG ICONS COMPONENTS
// ==========================================
// Menggunakan SVG inline murni untuk menghilangkan dependensi ke lucide-react / react-icons.
// Ini mencegah kegagalan compile di server/lokal akibat error lock dependency.

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
);

const CompassIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);

const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const ThumbsUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
);

const MessageSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

// ==========================================
// 2. INTERFACE DEFINITIONS
// ==========================================
// Typescript interfaces untuk memastikan type-safety pada properties dan state.
interface HomeProps {
  dict: any; // Kamus bahasa opsional (dari sistem i18n lokal)
  lang: string; // Kode bahasa aktif
}

interface GeneratedContent {
  status: string;
  content: {
    hook: string;
    body: string;
    callToAction: string;
    hashtags: string[];
  };
  visualRecommendation: string;
  recommendedPostingTime: string;
}

export default function InteractivePortfolio({ dict, lang }: HomeProps) {
  // ==========================================
  // 3. REACT STATE MANAGEMENT
  // ==========================================
  // State untuk menangkap data input form
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("Santai");
  const [platform, setPlatform] = useState("Instagram");
  const [historicalBestTime, setHistoricalBestTime] = useState("");
  
  // State untuk menangani loading state & feedback interaksi copy clipboard
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // State utama untuk menyimpan output JSON dari Gemini API
  const [generatedData, setGeneratedData] = useState<GeneratedContent | null>(null);

  // ==========================================
  // 4. API REQUEST HANDLER
  // ==========================================
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman default saat submit form
    if (!topic || !targetAudience) return;

    setIsLoading(true);
    try {
      // Mengirimkan request POST ke API route Next.js (/api/generate)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          targetAudience,
          tone,
          platform,
          historicalBestTime,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setGeneratedData(data); // Simpan output sukses ke state untuk di-render
      } else {
        console.error("Gagal men-generate konten:", data);
      }
    } catch (error) {
      console.error("Kesalahan koneksi API:", error);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  // ==========================================
  // 5. UTILITY FUNCTIONS
  // ==========================================
  // Fungsi menyalin teks hasil generate ke Clipboard sistem operasi
  const handleCopyText = () => {
    if (!generatedData) return;
    const { hook, body, callToAction, hashtags } = generatedData.content;
    const fullText = `${hook}\n\n${body}\n\n${callToAction}\n\n${hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset status copy setelah 2 detik
  };

  // Fungsi pengisi data contoh otomatis (few-shot helper untuk mempermudah testing)
  const loadExample = () => {
    setTopic("Membuka slot komisi (open commission) untuk ilustrasi karakter digital");
    setTargetAudience("Penggemar game RPG, kolektor seni, dan komunitas anime");
    setTone("Santai, antusias, dan bersahabat");
    setPlatform("Instagram");
    setHistoricalBestTime("Jumat malam, 19:30");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background radial glow gradients (efek estetika modern) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
              <SparklesIcon />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                SocialPilot.AI
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono">CO-PILOT AGENT</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Status indicator agen */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Agent Active
            </span>
            <button
              onClick={loadExample}
              className="text-xs px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 hover:text-white cursor-pointer"
            >
              Load Example
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* PANEL KIRI: Form Input & Grafik Analitik (7 Columns pada screen besar) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Quick Metrics Widget */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 transition duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-zinc-500 text-xs font-medium">Avg Engagement</span>
                <TrendingUpIcon />
              </div>
              <p className="text-xl font-bold text-white">4.8%</p>
              <p className="text-[10px] text-emerald-400 mt-1">+1.2% vs last month</p>
            </div>
            <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 transition duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-zinc-500 text-xs font-medium">Best Posting Hour</span>
                <ClockIcon />
              </div>
              <p className="text-xl font-bold text-white">19:30</p>
              <p className="text-[10px] text-zinc-500 mt-1">Based on historical data</p>
            </div>
            <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 transition duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-zinc-500 text-xs font-medium">Top Platform</span>
                <div className="text-pink-400"><InstagramIcon /></div>
              </div>
              <p className="text-xl font-bold text-white">Instagram</p>
              <p className="text-[10px] text-zinc-500 mt-1">62% of total traffic</p>
            </div>
          </div>

          {/* Generator Input Form */}
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <FlameIcon />
              <h2 className="text-lg font-semibold text-white">Generate Social Campaign</h2>
            </div>
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                  Topik Utama Konten
                </label>
                <textarea
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Misal: Membuka slot komisi ilustrasi karakter anime..."
                  rows={3}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-600 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                    Audiens Target
                  </label>
                  <input
                    type="text"
                    required
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Misal: Kolektor seni, Gamers"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                    Tone / Gaya Bahasa
                  </label>
                  <input
                    type="text"
                    required
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="Misal: Santai, antusias, profesional"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2.5 uppercase tracking-wider">
                  Pilih Platform
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "Instagram", icon: InstagramIcon, color: "hover:border-pink-500/50 hover:bg-pink-500/5" },
                    { name: "LinkedIn", icon: LinkedinIcon, color: "hover:border-blue-500/50 hover:bg-blue-500/5" },
                    { name: "Twitter", icon: TwitterIcon, color: "hover:border-sky-500/50 hover:bg-sky-500/5" },
                    { name: "TikTok", icon: VideoIcon, color: "hover:border-rose-500/50 hover:bg-rose-500/5" },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = platform === p.name;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setPlatform(p.name)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                            : `bg-zinc-950/40 border-zinc-800 text-zinc-400 ${p.color}`
                        }`}
                      >
                        <div className="mb-1"><Icon /></div>
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                  Waktu Performa Terbaik (Opsional)
                </label>
                <input
                  type="text"
                  value={historicalBestTime}
                  onChange={(e) => setHistoricalBestTime(e.target.value)}
                  placeholder="Misal: Jumat malam, 19:30 (jika kosong, menggunakan standar industri)"
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl py-3 font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCwIcon className="animate-spin" />
                    Memproses ide konten...
                  </>
                ) : (
                  <>
                    <ZapIcon />
                    Optimalkan & Generate Konten
                  </>
                )}
              </button>
            </form>
          </div>

          {/* INTERACTIVE SVG ANALYTICAL GRAPH */}
          {/* Grafik ini dibangun menggunakan tag SVG native murni. Sangat performant, ringan, */}
          {/* dan bebas dari error compile bundler react/next.js. */}
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <BarChartIcon />
                <h3 className="text-base font-semibold text-white">Engagement Rate per Posting Time</h3>
              </div>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">REAL-TIME DATA</span>
            </div>
            
            <div className="relative h-48 w-full">
              <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  {/* Linear gradients untuk warna grafik agar tampak premium */}
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {/* Garis-garis grid putus-putus */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Area bawah grafik */}
                <path
                  d="M 10 140 Q 90 90, 160 120 T 310 50 T 400 110 T 490 60 L 490 160 L 10 160 Z"
                  fill="url(#chartGrad)"
                />
                
                {/* Garis stroke grafik */}
                <path
                  d="M 10 140 Q 90 90, 160 120 T 310 50 T 400 110 T 490 60"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3.5"
                />
                
                {/* Bulatan titik-titik data (Data Points) */}
                <circle cx="90" cy="90" r="4.5" fill="#6366f1" stroke="#09090b" strokeWidth="2" />
                <circle cx="310" cy="50" r="5.5" fill="#ec4899" stroke="#09090b" strokeWidth="2" />
                <circle cx="490" cy="60" r="4.5" fill="#8b5cf6" stroke="#09090b" strokeWidth="2" />
                
                {/* Penunjuk Tooltip interaktif */}
                <g transform="translate(260, 10)">
                  <rect width="100" height="28" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
                  <text x="50" y="18" fill="#a1a1aa" fontSize="10" textAnchor="middle">
                    Peak: 19:30 (Jumat)
                  </text>
                </g>
              </svg>
            </div>
            
            {/* Label axis horizontal */}
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-2">
              <span>08:00</span>
              <span>12:00</span>
              <span>15:00</span>
              <span>18:00</span>
              <span>19:30</span>
              <span>22:00</span>
            </div>
          </div>

        </div>

        {/* PANEL KANAN: Output AI & Visual Mockup Preview (5 Columns pada screen besar) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 shadow-xl flex-1 flex flex-col">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <ZapIcon />
              Generated Strategy Output
            </h3>

            {/* Empty State: Tampil jika belum ada data yang di-generate */}
            {!generatedData && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                <CompassIcon className="text-zinc-700 mb-3 animate-bounce" />
                <p className="text-sm text-zinc-400 font-medium">Belum ada konten yang di-generate</p>
                <p className="text-xs text-zinc-500 mt-1">Isi formulir dan klik "Generate" untuk memulai analisis kecerdasan buatan.</p>
              </div>
            )}

            {/* Loading State: Tampil saat request API sedang berjalan */}
            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <RefreshCwIcon className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-sm text-zinc-300 font-medium animate-pulse">Menghubungkan ke Gemini Social Analytics...</p>
                <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 animate-pulse" />
                </div>
              </div>
            )}

            {/* Success State: Tampil jika data berhasil didapatkan dari serverless API */}
            {generatedData && !isLoading && (
              <div className="flex-1 flex flex-col gap-5 justify-between">
                
                {/* Metadata Tambahan (Waktu & Visual Recommendation) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-xs text-indigo-300 bg-indigo-500/5 px-3 py-2 rounded-lg border border-indigo-500/10">
                    <div className="text-indigo-400"><ClockIcon /></div>
                    <div>
                      <span className="font-semibold text-zinc-300">Waktu Posting Terbaik: </span>
                      {generatedData.recommendedPostingTime}
                    </div>
                  </div>
                  
                  <div className="text-xs text-pink-300 bg-pink-500/5 px-3 py-2 rounded-lg border border-pink-500/10">
                    <div className="font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                      <SparklesIcon />
                      Rekomendasi Visual:
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{generatedData.visualRecommendation}</p>
                  </div>
                </div>

                {/* SOCIAL MEDIA FEED MOCKUP PREVIEW */}
                {/* Secara dinamis berubah sesuai platform terpilih (Instagram, LinkedIn, Twitter/X, TikTok) */}
                <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden shadow-2xl">
                  
                  {/* Mockup Instagram Header */}
                  {platform.toLowerCase() === "instagram" && (
                    <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-0.5">
                          <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-[10px] font-bold text-white">SP</div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">your_brand</p>
                          <p className="text-[10px] text-zinc-500">Sponsored</p>
                        </div>
                      </div>
                      <span className="text-white font-bold tracking-widest text-xs">•••</span>
                    </div>
                  )}

                  {/* Mockup LinkedIn Header */}
                  {platform.toLowerCase() === "linkedin" && (
                    <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-xs font-bold text-white">SP</div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">SocialPilot Enterprise</p>
                          <p className="text-[10px] text-zinc-500">1st • Software Solution</p>
                        </div>
                      </div>
                      <span className="text-zinc-500 text-xs">Follow</span>
                    </div>
                  )}

                  {/* Mockup Twitter/X Header */}
                  {platform.toLowerCase() === "twitter" && (
                    <div className="border-b border-zinc-900 px-4 py-3 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">X</div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">SocialPilotAI <span className="font-normal text-zinc-500 text-[10px]">@SocialPilotAI</span></p>
                        <p className="text-[10px] text-zinc-500">1h</p>
                      </div>
                    </div>
                  )}

                  {/* Mockup TikTok Header */}
                  {platform.toLowerCase() === "tiktok" && (
                    <div className="border-b border-zinc-900 px-4 py-3 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-black">T</div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">@socialpilot_creative</p>
                        <p className="text-[10px] text-zinc-500">Viral content creator</p>
                      </div>
                    </div>
                  )}

                  {/* Body Konten Post Media Sosial */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-bold text-indigo-400">{generatedData.content.hook}</p>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{generatedData.content.body}</p>
                    <p className="text-xs font-medium text-zinc-400">{generatedData.content.callToAction}</p>
                    <p className="text-xs text-indigo-400/90 font-medium">
                      {generatedData.content.hashtags.join(" ")}
                    </p>
                  </div>

                  {/* Mockup Box Gambar Visualisasi Konten */}
                  <div className="bg-zinc-900/80 border-t border-zinc-900 aspect-video flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-pink-400/80 mb-2"><SparklesIcon /></div>
                    <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mb-1">Visual Preview Concept</p>
                    <p className="text-[10px] text-zinc-500 max-w-xs">{generatedData.visualRecommendation}</p>
                  </div>

                  {/* Footer Post Interactions (Like, Comment, Share) */}
                  <div className="border-t border-zinc-900 px-4 py-2.5 flex justify-between text-zinc-500 text-xs">
                    <span className="flex items-center gap-1.5 hover:text-white cursor-pointer"><ThumbsUpIcon /> Like</span>
                    <span className="flex items-center gap-1.5 hover:text-white cursor-pointer"><MessageSquareIcon /> Comment</span>
                    <span className="flex items-center gap-1.5 hover:text-white cursor-pointer"><ShareIcon /> Share</span>
                  </div>
                </div>

                {/* Tombol Aksi Akhir (Copy & Regenerate) */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyText}
                    className="flex-1 cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-xl py-3 text-xs font-medium flex items-center justify-center gap-2 transition"
                  >
                    {copied ? (
                      <>
                        <CheckIcon />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <CopyIcon />
                        Copy Caption
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleGenerate}
                    className="cursor-pointer bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white p-3 rounded-xl transition"
                    title="Regenerate"
                  >
                    <RefreshCwIcon />
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-6 bg-zinc-950/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-zinc-600 font-mono">
          &copy; 2026 SocialPilot.AI - Crafted for Visual Excellence & Engagement Optimization
        </div>
      </footer>
    </div>
  );
}
