# 🧩 Travel Knapsack Puzzle Quest — Game Simulasi 0/1 Knapsack

Game edukasi interaktif dan simulasi visual bertema **casual puzzle adventure** untuk membandingkan pemilihan manual, **Algoritma Greedy (Profit, Weight, Density)**, dan solusi optimal **Dynamic Programming (0/1 Knapsack Problem)** dengan kapasitas koper **100 kg**.

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18 ke atas disarankan) di komputer Anda. Cek dengan perintah:
```bash
node -v
npm -v
```

### 2. Instal Dependensi
Buka terminal (PowerShell / Command Prompt / Terminal VS Code) di folder proyek ini, lalu jalankan:
```bash
npm install
```

### 3. Jalankan Mode Development (Server Lokal)
Jalankan perintah berikut:
```bash
npm run dev
```

Setelah server aktif, buka browser Anda dan akses:
👉 **[http://localhost:3000](http://localhost:3000)** (atau port yang tertera di terminal)

---

## 🎮 Fitur & Visual Baru Bertema Puzzle Game

- **Vibrant & Playful Puzzle UI:** Warna-warni ceria dengan palet kategori bertema (Pakaian: Rose, Elektronik: Sky, Perlengkapan: Emerald, Toiletries: Purple, Bekal: Orange, Aksesori: Indigo).
- **Tactile 3D Buttons:** Tombol bergaya arcade puzzle dengan efek tekan nyata (`btn-3d`).
- **Interactive Trunk / Koper 100 kg:**
  - Indikator kapasitas animasi dengan *candy-striped progress bar*.
  - Pemecahan balok berat tiap barang (*segmented item weight breakdown*) seperti puzzle balok.
  - Gauge muatan koper dinamis.
- **2 Mode Permainan:**
  - 🎮 **Mode Manual (Pemain):** Cari, filter, dan pilih barang sendiri dari katalog.
  - 🤖 **Mode Otomatis (Simulasi Greedy):** Animasi langkah demi langkah bot mengevaluasi barang ke dalam koper dengan 3 strategi (Greedy by Profit, Greedy by Weight, Greedy by Density).
- **⭐⭐⭐ 3-Star Rating System:** Evaluasi pencapaian skor berdasarkan rasio terhadap solusi optimal Dynamic Programming.
- **🔑 DP Solution Reveal:** Kunci jawaban optimal dari algoritma Dynamic Programming dengan tombol 1-klik untuk memasang kombinasi optimal ke dalam koper.
- **📄 Laporan Tugas Akademik:** Salinan laporan analisis algoritma lengkap siap pakai untuk tugas kuliah Strategi Algoritma Semester 3.
- **🔊 Sintesis Suara & Mode Gelap:** Dilengkapi efek suara Web Audio API dan toggle tema Terang / Gelap.

---

## 🛠️ Perintah Lainnya

- **Build untuk Production:**
  ```bash
  npm run build
  ```
- **Preview Hasil Build:**
  ```bash
  npm run preview
  ```
- **Jalankan Unit Test:**
  ```bash
  npx tsx src/game/knapsack.test.ts
  ```

