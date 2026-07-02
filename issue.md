# Membangun Endpoint API Backend (Integrasi AI)

## Deskripsi
Saat ini, endpoint `/api/ai-agent` masih menggunakan data statis (mock) untuk merespons permintaan fitur Co-Pilot. Kita perlu mengintegrasikan model AI generatif yang sebenarnya (seperti Google Gemini API) agar fitur Co-Pilot dapat merespons secara dinamis dan cerdas untuk tugas-tugas seperti _Content Generation_, _Metrics Analysis_, dan _Sentiment Analysis_.

## Tujuan
- Menghubungkan aplikasi dengan layanan AI generatif eksternal.
- Mengubah endpoint `/api/ai-agent` agar meneruskan payload pengguna sebagai prompt ke model AI dan mengembalikan respons yang diformat.
- Memastikan respons AI diformat menjadi JSON terstruktur (seperti pembagian hook, caption, CTA, dan hashtags untuk pembuatan konten).
- Menyimpan riwayat interaksi yang dihasilkan AI secara otomatis ke tabel `AIInteraction` (berdasarkan skema yang dibuat pada Issue #5).

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Konfigurasi API key AI (misalnya `GEMINI_API_KEY`) tersedia dan dapat diakses dari file `.env`.
- [ ] Endpoint `/api/ai-agent` berhasil memanggil layanan AI eksternal.
- [ ] Prompt engineering diterapkan sesuai dengan jenis aksi (`generate_content`, `analyze_metrics`, `sentiment_analysis`).
- [ ] Output dari AI di-parse menjadi format JSON yang konsisten dengan kebutuhan UI komponen Co-Pilot.
- [ ] Tabel `AIInteraction` (Audit Log) berhasil menyimpan prompt asli dan respons aktual dari model AI.
- [ ] Terdapat penanganan error (error handling) yang baik jika layanan AI mengalami kegagalan, timeout, atau limit akses.

## Langkah Implementasi yang Disarankan
1. Daftarkan dan dapatkan API Key (misal dari Google AI Studio untuk Gemini).
2. Install SDK yang relevan (contoh: `npm install @google/generative-ai`).
3. Refactor implementasi di `src/app/api/ai-agent/route.ts` dengan menghapus data mock dan menggantinya dengan panggilan ke API AI.
4. Tulis instruksi sistem (system instructions) atau rancang prompt yang spesifik untuk memastikan model AI selalu membalas dalam format JSON yang valid.
5. Lakukan uji coba end-to-end melalui UI Co-Pilot di dashboard.
