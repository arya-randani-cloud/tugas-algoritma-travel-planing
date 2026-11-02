import React, { useState } from 'react';

interface AcademicReportModalProps {
  open: boolean;
  onClose: () => void;
}

export const REPORT_TEXT_TEMPLATE = `LAPORAN TUGAS MATA KULIAH STRATEGI ALGORITMA
Topik: Implementasi GUI Permainan 0/1 Knapsack Problem — Simulasi Pengemasan Koper Perjalanan Liburan (Kapasitas 100 kg)
Tingkat: Semester 3 — Program Studi Teknik Informatika

1. LATAR BELAKANG & DESKRIPSI PERMAINAN
Permainan "Travel Knapsack Game: Rencana Koper Liburan" merupakan simulasi interaktif berbasis GUI untuk memvisualisasikan permasalahan klasik 0/1 Knapsack Problem. Dalam skenario permainan ini, pemain berperan sebagai wisatawan yang sedang menyusun rencana perjalanan jauh / liburan dan harus memilih barang-barang bawaan untuk dimasukkan ke dalam koper yang memiliki kapasitas maksimum tetap sebesar W = 100 kg.

Setiap barang bawaan (item ke-i) memiliki tiga atribut utama:
- Kategori Barang (Pakaian, Elektronik, Perlengkapan Liburan, Toiletries & Obat, Bekal & Konsumsi, serta Aksesori & Dokumen)
- Bobot (w_i dalam satuan kg)
- Nilai Kepentingan / Profit (p_i)

Tujuan pemain adalah memilih kombinasi barang ke dalam koper sehingga Total Profit maksimal tanpa membuat Total Berat melebihi kapasitas koper 100 kg.Setiap barang bersifat 0/1 (hanya bisa dibawa utuh 1 buah atau ditinggalkan, tidak dapat dibagi/dipecah).

2. FITUR ANTARMUKA (GUI) & MODE PERMAINAN
Sesuai spesifikasi tugas, aplikasi ini menampilkan Bobot dan Profit pada setiap kartu barang serta menyediakan panel Koper Perjalanan yang secara real-time menampilkan:
- Total Berat (kg) dan Sisa Kapasitas dari batas 100 kg
- Total Profit yang berhasil dikumpulkan
- Rincian daftar barang di dalam koper per kategori

Terdapat dua mode permainan utama:
a) Manual Mode:
   Pemain memilih dan mengeluarkan barang secara bebas dari katalog menggunakan bantuan fitur pencarian ID/nama, filter Kategori Barang, filter status muatan, serta pengurutan (berdasarkan ID, Berat, Profit, atau Rasio Profit/kg). Setelah selesai memilih, sistem mengevaluasi apakah pilihan pemain sudah mencapai profit optimal.

b) Automatic Mode (Simulasi Algoritma Greedy):
   Sistem menjalankan algoritma Greedy secara otomatis langkah demi langkah (step-by-step animation) sehingga pengguna dapat mengamati barang mana yang sedang dievaluasi, apakah barang tersebut muat ke dalam sisa kapasitas koper 100 kg, serta perubahan Total Berat dan Total Profit pada setiap langkah.
   Tersedia 3 variasi heuristik Greedy yang dipelajari di perkuliahan Strategi Algoritma:
   - Greedy by Profit: Mengurutkan barang dari profit tertinggi ke terendah.
   - Greedy by Weight: Mengurutkan barang dari bobot paling ringan ke terberat.
   - Greedy by Density (Profit/Weight): Mengurutkan barang berdasarkan rasio nilai per kg tertinggi.

3. ANALISIS ALGORITMA & PERBANDINGAN SOLUSI OPTIMAL
Di balik layar, program menghitung nilai solusi eksak (Optimal Profit) menggunakan algoritma Dynamic Programming (DP) 0/1 Knapsack dengan relasi rekurensi:
   dp[i][c] = max(dp[i-1][c], dp[i-1][c - w_i] + p_i)  untuk w_i <= c

Perbandingan Kompleksitas:
- Algoritma Greedy: Kompleksitas waktu O(n log n) untuk pengurutan barang dan O(n) untuk pemindaian isi koper. Sangat cepat, namun bersifat heuristik (lokal optimal) sehingga TIDAK selalu menjamin solusi optimal global pada 0/1 Knapsack Problem karena menyisakan ruang kosong (idle capacity) yang tidak dapat diisi barang pecahan.
- Dynamic Programming (0/1 DP): Kompleksitas waktu dan ruang semu-polinomial O(n * W) dengan W = 100. Selalu menghasilkan kombinasi barang dengan Total Profit maksimal yang sesungguhnya.

4. KESIMPULAN
Melalui simulasi pengemasan koper perjalanan 100 kg ini, dapat dibuktikan secara visual bahwa strategi Greedy bekerja sangat cepat namun sering menghasilkan selisih profit dibandingkan solusi Dynamic Programming pada masalah 0/1 Knapsack. Pemain dapat membandingkan langsung kombinasi pilihannya, hasil algoritma Greedy, dan solusi optimal DP pada jendela evaluasi akhir.`;

export const AcademicReportModal: React.FC<AcademicReportModalProps> = ({
  open,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REPORT_TEXT_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard blocked in iframe
      const ta = document.createElement('textarea');
      ta.value = REPORT_TEXT_TEMPLATE;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="reportM"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-[var(--pn)] border border-[var(--ln)] shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--ln)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ac)] mb-1">
              Dokumen Tugas Kuliah · Strategi Algoritma (Semester 3)
            </p>
            <h2
              id="report-modal-title"
              className="text-xl sm:text-2xl font-extrabold text-[var(--ink)]"
            >
              Laporan Penjelasan Game &amp; Analisis Algoritma
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup laporan"
            className="rounded-xl border border-[var(--ln)] bg-[var(--bg)] hover:border-[var(--ac)] px-3 py-1.5 text-sm font-bold text-[var(--ink)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="my-4 overflow-y-auto pr-1 space-y-5 text-sm text-[var(--ink)] leading-relaxed">
          {/* 1. Konsep & Tema */}
          <div className="rounded-xl bg-[var(--bg)] border border-[var(--ln)] p-4">
            <h3 className="text-base font-bold text-[var(--ink)] mb-1.5">
              1. Konsep Permainan: Rencana Koper Perjalanan Liburan (100 kg)
            </h3>
            <p className="text-[var(--mut)]">
              Game ini memodelkan masalah optimasi kombinatorial{' '}
              <strong className="text-[var(--ink)]">0/1 Knapsack Problem</strong> ke dalam simulasi menyusun
              rencana perjalanan jauh atau liburan. Pemain harus memilih barang-barang kebutuhan liburan untuk
              dimasukkan ke dalam koper dengan batas kapasitas maksimum tetap sebesar{' '}
              <strong className="font-mono-num text-[var(--ac)]">W = 100 kg</strong>.
            </p>
            <p className="text-[var(--mut)] mt-2">
              Setiap barang dikelompokkan ke dalam <strong className="text-[var(--ink)]">6 kategori perjalanan</strong>{' '}
              (<em>Pakaian</em>, <em>Elektronik</em>, <em>Perlengkapan Liburan</em>, <em>Toiletries &amp; Obat</em>,{' '}
              <em>Bekal &amp; Konsumsi</em>, dan <em>Aksesori &amp; Dokumen</em>) serta menampilkan{' '}
              <strong className="text-[var(--ink)]">Bobot (kg)</strong> dan{' '}
              <strong className="text-[var(--ink)]">Profit</strong> secara eksplisit pada GUI.
            </p>
          </div>

          {/* 2. Mode Manual vs Automatic */}
          <div className="rounded-xl bg-[var(--bg)] border border-[var(--ln)] p-4">
            <h3 className="text-base font-bold text-[var(--ink)] mb-1.5">
              2. Mekanisme Mode Manual &amp; Mode Automatic (Greedy)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--mut)]">
              <li>
                <strong className="text-[var(--ink)]">Manual Mode:</strong> Pemain memilih sendiri barang yang ingin
                dimasukkan ke koper dengan memanfaatkan filter kategori, pencarian ID/nama, serta pengurutan. Sistem
                menolak barang apabila bobotnya melebihi sisa kapasitas dari 100 kg, dan langsung memvalidasi apakah
                kombinasi koper sudah mencapai profit maksimal.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Automatic Mode (Simulasi Greedy):</strong> Menampilkan proses
                kerja algoritma Greedy langkah demi langkah. Pemain dapat menguji tiga pendekatan yang dipelajari di
                mata kuliah Strategi Algoritma:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    <strong>Greedy by Profit:</strong> Memilih barang dengan nilai profit terbesar terlebih dahulu.
                  </li>
                  <li>
                    <strong>Greedy by Weight:</strong> Memilih barang dengan bobot paling ringan terlebih dahulu agar
                    memuat banyak barang.
                  </li>
                  <li>
                    <strong>Greedy by Density (Profit/Bobot):</strong> Memilih barang dengan rasio kepadatan profit
                    per kilogram tertinggi.
                  </li>
                </ul>
              </li>
              <li>
                Pada kedua mode, panel koper selalu menampilkan <strong className="text-[var(--ink)]">Total Berat</strong>{' '}
                dan <strong className="text-[var(--ink)]">Total Profit</strong> secara langsung (<em>real-time</em>).
              </li>
            </ul>
          </div>

          {/* 3. Pemodelan Matematis & Kompleksitas */}
          <div className="rounded-xl bg-[var(--bg)] border border-[var(--ln)] p-4">
            <h3 className="text-base font-bold text-[var(--ink)] mb-1.5">
              3. Pemodelan Matematis &amp; Perbandingan dengan Dynamic Programming
            </h3>
            <p className="text-[var(--mut)] mb-2">
              Misalkan terdapat <span className="font-mono-num">n</span> barang di mana barang ke-
              <span className="font-mono-num">i</span> memiliki bobot <span className="font-mono-num">w_i</span> dan
              profit <span className="font-mono-num">p_i</span>, serta kapasitas koper{' '}
              <span className="font-mono-num">W = 100</span> kg. Fungsi objektifnya adalah:
            </p>
            <div className="rounded-lg bg-[var(--pn)] border border-[var(--ln)] px-3.5 py-2.5 font-mono-num text-xs text-[var(--ink)] mb-2">
              Maksimalkan ∑ (p_i · x_i) dengan kendala ∑ (w_i · x_i) ≤ 100 dan x_i ∈ &#123;0, 1&#125;
            </div>
            <p className="text-[var(--mut)]">
              Untuk mengetahui apakah pilihan pemain atau hasil algoritma Greedy sudah optimal, program ini menghitung
              solusi eksak di balik layar menggunakan <strong className="text-[var(--ink)]">Dynamic Programming (DP)</strong>{' '}
              berkompleksitas <span className="font-mono-num">O(n · W)</span>. Hal ini menunjukkan secara nyata bahwa
              algoritma Greedy (<span className="font-mono-num">O(n log n)</span>) bersifat heuristik dan tidak selalu
              menghasilkan solusi terbaik pada masalah 0/1 Knapsack.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--ln)] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[var(--mut)]">
            Teks laporan lengkap siap disalin ke dokumen tugas kelompok (Word / Google Docs).
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-[var(--ac)] hover:opacity-95 px-4 py-2 text-xs sm:text-sm font-bold text-white cursor-pointer whitespace-nowrap"
            >
              {copied ? '✓ Teks Laporan Tersalin!' : 'Salin Teks Laporan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--ln)] bg-[var(--bg)] hover:border-[var(--ac)] px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--ink)] cursor-pointer whitespace-nowrap"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
