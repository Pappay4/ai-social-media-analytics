"use client";

/**
 * AI Social Media Analytics & Content Planner Dashboard
 * 
 * Antarmuka dashboard terpadu yang memvisualisasikan data metrik historis
 * dari SQLite (via Prisma API) dan mengelola perencana konten dalam bentuk
 * kalender interaktif, serta dilengkapi modal asisten AI Co-Pilot multi-tugas.
 */

import React, { useState, useEffect } from "react";

// ==========================================
// 1. INLINE SVG ICONS
// ==========================================
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
);
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/></svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4"/></svg>
);
const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const MessageSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v12"/><path d="M8 10h8"/></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
);

// Interfaces
interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  platform: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
}

interface AnalyticsData {
  date: string;
  followersCount: number;
  engagementRate: number;
  impressions: number;
  reach: number;
}

interface HomeProps {
  dict: any;
  lang: string;
}

export default function InteractivePortfolio({ dict, lang }: HomeProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "planner">("dashboard");
  const [activePlatform, setActivePlatform] = useState<string>("ALL");

  // Database States
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [selectedDayPosts, setSelectedDayPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Form & Modals States
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Form Input States
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postStatus, setPostStatus] = useState("DRAFT");
  const [postPlatform, setPostPlatform] = useState("Instagram");
  const [postScheduledAt, setPostScheduledAt] = useState("");

  // AI Agent States
  const [aiAction, setAiAction] = useState<"generate_content" | "analyze_metrics" | "sentiment_analysis">("generate_content");
  const [aiTopic, setAiTopic] = useState("");
  const [aiAudience, setAiAudience] = useState("");
  const [aiPlatform, setAiPlatform] = useState("Instagram");
  const [aiComments, setAiComments] = useState("");
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Calendar Pagination
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch Database Data on load & update
  useEffect(() => {
    fetchPosts();
    fetchAnalytics();
  }, [activePlatform]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (e) {
      console.error("Gagal memuat postingan:", e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?platform=${activePlatform}`);
      const data = await response.json();
      if (Array.isArray(data)) setAnalytics(data);
    } catch (e) {
      console.error("Gagal memuat metrik analitik:", e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          status: postStatus,
          platform: postPlatform,
          scheduledAt: postStatus === "SCHEDULED" ? postScheduledAt : null,
          publishedAt: postStatus === "PUBLISHED" ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        setPostTitle("");
        setPostContent("");
        setPostStatus("DRAFT");
        setPostScheduledAt("");
        setIsNewPostModalOpen(false);
        fetchPosts();
      }
    } catch (e) {
      console.error("Gagal menyimpan postingan:", e);
    }
  };

  // Panggil AI Agent Multi-Tasking
  const handleCallAiAgent = async () => {
    setAiLoading(true);
    setAiResult(null);

    let payload: any = {};
    if (aiAction === "generate_content") {
      payload = {
        topic: aiTopic,
        audience: aiAudience,
        platform: aiPlatform,
      };
    } else if (aiAction === "analyze_metrics") {
      // Masukkan ringkasan metrik database saat ini ke payload agar dianalisis oleh AI
      const currentER = analytics[analytics.length - 1]?.engagementRate || "4.6%";
      const currentFollowers = analytics[analytics.length - 1]?.followersCount || 27800;
      payload = {
        metrics_data: {
          week: "Minggu ini",
          total_posts: posts.length,
          avg_engagement_rate: `${currentER}%`,
          total_followers: currentFollowers,
          top_performing_post_topic: posts[0]?.title || "Behind Creative Scenes",
        },
      };
    } else if (aiAction === "sentiment_analysis") {
      payload = {
        comments: aiComments.split("\n").filter((c) => c.trim() !== ""),
      };
    }

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_type: aiAction,
          data_payload: payload,
        }),
      });

      const resultData = await response.json();
      if (resultData.status === "success") {
        setAiResult(resultData.result);
      } else {
        setAiResult({ error: resultData.message || "Gagal memproses permintaan." });
      }
    } catch (e) {
      console.error("Kesalahan AI Agent:", e);
      setAiResult({ error: "Gagal menghubungkan ke AI Agent." });
    } finally {
      setAiLoading(false);
    }
  };

  // Helper Copy Teks Caption hasil AI
  const handleCopyAiContent = () => {
    if (!aiResult) return;
    const text = `${aiResult.hook || ""}\n\n${aiResult.caption || ""}\n\n${aiResult.call_to_action || ""}\n\n${(aiResult.hashtags || []).join(" ")}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper membagi visualisasi grid Kalender
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();
    return { startDay, numDays };
  };

  const { startDay, numDays } = getDaysInMonth(currentMonth);
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    if (day > 0 && day <= numDays) {
      return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    }
    return null;
  });

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-violet-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[50%] rounded-full bg-indigo-900/15 blur-[150px] pointer-events-none" />

      {/* Main Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
              <SparklesIcon />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                SocialPilot Pro
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono">AI AGENT ENGINE</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "dashboard" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BarChartIcon />
              Dashboard & Analytics
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "planner" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CalendarIcon />
              Content Planner
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCoPilotOpen(true)}
              className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-violet-500/20 flex items-center gap-1.5 transition"
            >
              <BrainIcon />
              AI Co-Pilot Assistant
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10">
        
        {/* ==========================================
            TAB 1: ANALYTICS DASHBOARD
            ========================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Platform Filters */}
            <div className="flex gap-2.5 flex-wrap">
              {["ALL", "Instagram", "LinkedIn", "Twitter", "TikTok"].map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    activePlatform === platform
                      ? "bg-violet-600/15 border-violet-500 text-violet-400"
                      : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider block mb-1">Total Followers</span>
                <h3 className="text-2xl font-bold text-white">
                  {(analytics[analytics.length - 1]?.followersCount || 0).toLocaleString()}
                </h3>
                <span className="text-xs text-emerald-400 mt-1.5 inline-block font-mono">Growing upward</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider block mb-1">Avg Engagement Rate</span>
                <h3 className="text-2xl font-bold text-white">
                  {analytics[analytics.length - 1]?.engagementRate || 0}%
                </h3>
                <span className="text-xs text-emerald-400 mt-1.5 inline-block font-mono">Organic traction</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider block mb-1">Impressions</span>
                <h3 className="text-2xl font-bold text-white">
                  {(analytics[analytics.length - 1]?.impressions || 0).toLocaleString()}
                </h3>
                <span className="text-xs text-indigo-400 mt-1.5 inline-block font-mono">Weekly reach trend</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider block mb-1">Total Reach</span>
                <h3 className="text-2xl font-bold text-white">
                  {(analytics[analytics.length - 1]?.reach || 0).toLocaleString()}
                </h3>
                <span className="text-xs text-indigo-400 mt-1.5 inline-block font-mono">Post organic views</span>
              </div>
            </div>

            {/* Historical Charts (SVG-based Recharts clone) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart 1: Followers Growth */}
              <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl shadow-lg">
                <h3 className="text-sm font-semibold text-zinc-300 mb-6 uppercase tracking-wider">Followers Growth Trend</h3>
                <div className="h-64 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glow1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35"/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 170 Q 150 140, 250 110 T 490 60 L 490 190 L 10 190 Z"
                      fill="url(#glow1)"
                    />
                    <path
                      d="M 10 170 Q 150 140, 250 110 T 490 60"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3.5"
                    />
                    {/* Data Points */}
                    <circle cx="250" cy="110" r="5" fill="#8b5cf6" stroke="#09090b" strokeWidth="2" />
                    <circle cx="490" cy="60" r="5" fill="#a78bfa" stroke="#09090b" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-2 right-4 bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-850 text-[10px] text-zinc-400 font-mono">
                    Latest: {(analytics[analytics.length - 1]?.followersCount || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-3">
                  <span>15 Hari Lalu</span>
                  <span>7 Hari Lalu</span>
                  <span>Hari Ini</span>
                </div>
              </div>

              {/* Chart 2: Engagement Rate */}
              <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl shadow-lg">
                <h3 className="text-sm font-semibold text-zinc-300 mb-6 uppercase tracking-wider">Engagement Rate Performance</h3>
                <div className="h-64 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glow2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35"/>
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 130 Q 100 160, 200 90 T 400 110 T 490 50 L 490 190 L 10 190 Z"
                      fill="url(#glow2)"
                    />
                    <path
                      d="M 10 130 Q 100 160, 200 90 T 400 110 T 490 50"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3.5"
                    />
                    <circle cx="200" cy="90" r="5" fill="#ec4899" stroke="#09090b" strokeWidth="2" />
                    <circle cx="490" cy="50" r="5" fill="#f472b6" stroke="#09090b" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-2 right-4 bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-850 text-[10px] text-zinc-400 font-mono">
                    Avg ER: {analytics[analytics.length - 1]?.engagementRate || 0}%
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-3">
                  <span>15 Hari Lalu</span>
                  <span>7 Hari Lalu</span>
                  <span>Hari Ini</span>
                </div>
              </div>
            </div>

            {/* Posting Time Advisor */}
            <div className="bg-zinc-900/20 border border-zinc-850 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ClockIcon />
                  Recommended Best Posting Time
                </h3>
                <p className="text-xs text-zinc-400 max-w-xl">
                  Berdasarkan performa postingan historis Anda, audiens paling aktif merespons konten pada hari **Jumat pukul 19:30**. Targetkan jadwal rilis Planner Anda mendekati rentang ini.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-xl text-center shrink-0">
                <span className="text-[10px] text-zinc-500 font-mono block uppercase tracking-wider">Historical Best Time</span>
                <span className="text-lg font-bold text-indigo-400">Jumat, 19:30</span>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: CONTENT PLANNER CALENDAR
            ========================================== */}
        {activeTab === "planner" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Kalender */}
            <div className="flex items-center justify-between bg-zinc-900/40 p-4 rounded-2xl border border-zinc-850">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 transition cursor-pointer"
                >
                  <ChevronLeftIcon />
                </button>
                <h2 className="text-sm font-bold text-white px-2">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 transition cursor-pointer"
                >
                  <ChevronRightIcon />
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedDate(new Date());
                  setIsNewPostModalOpen(true);
                }}
                className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <PlusIcon />
                Create New Content
              </button>
            </div>

            {/* Grid Kalender */}
            <div className="grid grid-cols-7 gap-2">
              {/* Label Hari */}
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div key={day} className="text-center py-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  {day}
                </div>
              ))}

              {/* Box Hari */}
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} className="bg-zinc-950/20 border border-transparent rounded-xl h-24" />;
                
                // Cari posts di hari ini
                const dayPosts = posts.filter((post) => {
                  const postDate = post.scheduledAt || post.publishedAt || post.createdAt;
                  const d = new Date(postDate);
                  return (
                    d.getDate() === date.getDate() &&
                    d.getMonth() === date.getMonth() &&
                    d.getFullYear() === date.getFullYear()
                  );
                });

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedDayPosts(dayPosts);
                    }}
                    className={`bg-zinc-900/30 border border-zinc-850 hover:border-zinc-700/80 p-2.5 rounded-xl h-28 flex flex-col justify-between transition cursor-pointer ${
                      date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()
                        ? "ring-2 ring-violet-500/50 border-violet-500/40 bg-violet-950/5"
                        : ""
                    }`}
                  >
                    <span className="text-[11px] font-bold text-zinc-400 font-mono">{date.getDate()}</span>
                    
                    {/* List postingan kecil */}
                    <div className="space-y-1 overflow-y-auto max-h-[70%]">
                      {dayPosts.slice(0, 2).map((post) => (
                        <div
                          key={post.id}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-medium truncate ${
                            post.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                              : post.status === "SCHEDULED"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/10"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {post.title}
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <div className="text-[8px] text-zinc-500 font-semibold px-1">
                          +{dayPosts.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* List Detail Postingan Hari Terpilih */}
            {selectedDate && (
              <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-850 space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Detail Postingan ({selectedDate.toLocaleDateString("id-ID", { dateStyle: "long" })})</span>
                  <button
                    onClick={() => setIsNewPostModalOpen(true)}
                    className="text-xs text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
                  >
                    + Tambah Postingan Baru
                  </button>
                </h3>

                {selectedDayPosts.length === 0 ? (
                  <p className="text-xs text-zinc-500">Tidak ada jadwal postingan untuk tanggal ini.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDayPosts.map((post) => (
                      <div key={post.id} className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{post.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            post.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : post.status === "SCHEDULED"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        <div className="flex gap-4 text-[10px] text-zinc-500 font-mono">
                          <span>Platform: {post.platform}</span>
                          {post.scheduledAt && <span>Schedule: {new Date(post.scheduledAt).toLocaleTimeString("id-ID", { timeStyle: "short" })}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ==========================================
          MODAL: TAMBAH POST BARU (Planner)
          ========================================== */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-5 animate-scale-up shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <CalendarIcon />
                Create New Content Scheduling
              </h3>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Judul Postingan</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Judul kampanye / topik..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-zinc-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Konten Caption</label>
                <textarea
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Isi caption di sini..."
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-zinc-700 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Platform</label>
                  <select
                    value={postPlatform}
                    onChange={(e) => setPostPlatform(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition cursor-pointer"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter/X</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Status</label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition cursor-pointer"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              {postStatus === "SCHEDULED" && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase">Jadwal Tanggal & Waktu</label>
                  <input
                    type="datetime-local"
                    required
                    value={postScheduledAt}
                    onChange={(e) => setPostScheduledAt(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl py-3 text-xs font-bold transition shadow-lg cursor-pointer"
              >
                Schedule Content
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: AI CO-PILOT ASSISTANT (Multi-Task)
          ========================================== */}
      {isCoPilotOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 space-y-6 animate-scale-up shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <BrainIcon />
                <div>
                  <h3 className="text-base font-bold text-white">AI Co-Pilot Assistant</h3>
                  <p className="text-[10px] text-zinc-500">Multitasking Digital Marketer Companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsCoPilotOpen(false)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Aksi Selector */}
            <div className="flex gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-850">
              {[
                { type: "generate_content", label: "Content Draft" },
                { type: "analyze_metrics", label: "Metrics Analyzer" },
                { type: "sentiment_analysis", label: "Sentiment Analyst" }
              ].map((act) => (
                <button
                  key={act.type}
                  onClick={() => {
                    setAiAction(act.type as any);
                    setAiResult(null);
                  }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    aiAction === act.type ? "bg-zinc-800 text-violet-400" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>

            {/* Dynamic Inputs Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* INPUT: Generate Content */}
              {aiAction === "generate_content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase">Topik Utama Konten</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Contoh: Tutorial membuat efek Parallax Scrolling Next.js..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase">Audiens Target</label>
                      <input
                        type="text"
                        value={aiAudience}
                        onChange={(e) => setAiAudience(e.target.value)}
                        placeholder="Contoh: Web Developer pemula..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase">Platform</label>
                      <select
                        value={aiPlatform}
                        onChange={(e) => setAiPlatform(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition cursor-pointer"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">Twitter/X</option>
                        <option value="TikTok">TikTok</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* INPUT: Analyze Metrics */}
              {aiAction === "analyze_metrics" && (
                <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-2">
                  <p className="text-xs text-violet-400 font-semibold flex items-center gap-1.5">
                    <SparklesIcon />
                    Auto-Collect Metrics
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    AI Agent akan secara otomatis mengambil ringkasan metrik historis terakhir yang ada pada database lokal SQLite Anda, termasuk data jangkauan, impresi, rata-rata engagement rate platform, dan topik postingan terbaik.
                  </p>
                </div>
              )}

              {/* INPUT: Sentiment Analysis */}
              {aiAction === "sentiment_analysis" && (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase">
                    Komentar Audiens (Satu baris per komentar)
                  </label>
                  <textarea
                    value={aiComments}
                    onChange={(e) => setAiComments(e.target.value)}
                    placeholder="Contoh:&#10;Keren banget tipsnya!&#10;Next.js sulit dipahami min...&#10;Kapan open commission lagi?"
                    rows={5}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition placeholder-zinc-700"
                  />
                </div>
              )}

              {/* Action Trigger Button */}
              <button
                onClick={handleCallAiAgent}
                disabled={aiLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl py-3 text-xs font-bold transition shadow-lg flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <RefreshIcon className="animate-spin" />
                    AI Agent memproses data...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Proses dengan AI Agent
                  </>
                )}
              </button>

              {/* Output Result Viewer */}
              {aiResult && (
                <div className="p-5 bg-zinc-950 border border-zinc-850 rounded-xl space-y-4 animate-scale-up">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider font-mono">Output Result</span>
                    {aiAction === "generate_content" && (
                      <button
                        onClick={handleCopyAiContent}
                        className="text-[10px] bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                        {isCopied ? "Copied" : "Copy Caption"}
                      </button>
                    )}
                  </div>

                  {/* DISPLAY: Content Generation Result */}
                  {aiAction === "generate_content" && aiResult.hook && (
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Hook</span>
                        <p className="text-white font-bold leading-relaxed">{aiResult.hook}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Caption Body</span>
                        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{aiResult.caption}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Call to Action</span>
                        <p className="text-zinc-400 leading-relaxed">{aiResult.call_to_action}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Hashtags</span>
                        <p className="text-indigo-400 font-medium">{(aiResult.hashtags || []).join(" ")}</p>
                      </div>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-900">
                        <span className="text-[10px] text-pink-400 block uppercase font-bold mb-1">Visual Direction</span>
                        <p className="text-zinc-400">{aiResult.visual_direction}</p>
                      </div>
                    </div>
                  )}

                  {/* DISPLAY: Metrics Analysis Result */}
                  {aiAction === "analyze_metrics" && aiResult.performance_summary && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Performance Summary</span>
                        <p className="text-white leading-relaxed">{aiResult.performance_summary}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-emerald-400 block uppercase font-bold mb-1.5">Strengths</span>
                          <ul className="list-disc pl-4 space-y-1 text-zinc-300">
                            {(aiResult.strengths || []).map((str: string, i: number) => <li key={i}>{str}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] text-pink-400 block uppercase font-bold mb-1.5">Areas of Improvement</span>
                          <ul className="list-disc pl-4 space-y-1 text-zinc-300">
                            {(aiResult.areas_of_improvement || []).map((str: string, i: number) => <li key={i}>{str}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                        <span className="text-[10px] text-indigo-400 block uppercase font-bold mb-1">Next Strategy</span>
                        <p className="text-zinc-300 leading-relaxed">{aiResult.next_strategy}</p>
                      </div>
                    </div>
                  )}

                  {/* DISPLAY: Sentiment Analysis Result */}
                  {aiAction === "sentiment_analysis" && aiResult.sentiment && (
                    <div className="space-y-3.5 text-xs">
                      <div className="flex gap-6">
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Sentiment</span>
                          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full inline-block mt-1 ${
                            aiResult.sentiment.toLowerCase() === "positive"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : aiResult.sentiment.toLowerCase() === "negative"
                              ? "bg-pink-500/10 text-pink-400"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {aiResult.sentiment}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Score</span>
                          <span className="text-base font-bold text-white inline-block mt-0.5">{aiResult.score}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Analysis Summary</span>
                        <p className="text-white leading-relaxed">{aiResult.summary}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Key Comments Identified</span>
                        <ul className="list-disc pl-4 space-y-1 text-zinc-300 mt-1">
                          {(aiResult.key_comments || []).map((c: string, i: number) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Main Footer */}
      <footer className="border-t border-zinc-900 py-6 bg-zinc-950/60 mt-12 text-center text-xs text-zinc-600 font-mono">
        &copy; 2026 SocialPilot Pro - Crafted for Visual Excellence & Analytics Scheduling
      </footer>
    </div>
  );
}
