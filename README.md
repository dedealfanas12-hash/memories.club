# Memories Club

Web app pembuat undangan/kartu digital custom (ulang tahun, anniversary,
wisuda, pernikahan, dan acara lainnya) dengan editor bebas geser/resize/
rotasi untuk teks, foto, dan bentuk — mirip Canva, tapi ringan dan bisa kamu
jalankan sendiri.

## Menjalankan di komputer

Butuh [Node.js](https://nodejs.org) versi 18 ke atas.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).
Semua fitur — bikin desain, upload foto, unduh gambar — langsung jalan tanpa
setup tambahan.

## Deploy ke GitHub Pages (gratis, tanpa layanan lain)

Repo ini sudah dilengkapi workflow GitHub Actions yang otomatis build dan
deploy setiap kali kamu push ke branch `main` — tidak perlu Vercel/Netlify
sama sekali.

1. Push folder ini ke repo GitHub (repo publik, kalau akun GitHub kamu
   bukan yang berbayar — Pages di repo privat butuh paket Pro/Team)
2. Di repo itu, buka **Settings → Pages**
3. Di bagian **Build and deployment → Source**, pilih **GitHub Actions**
4. Push apa pun ke `main` (atau buka tab **Actions**, pilih workflow
   "Deploy to GitHub Pages", klik **Run workflow** untuk trigger manual)
5. Tunggu sampai workflow selesai (ikon centang hijau di tab Actions),
   lalu situsnya bisa diakses di `https://<username-kamu>.github.io/<nama-repo>/`

Workflow-nya otomatis mendeteksi nama repo untuk path aset, jadi apa pun
nama repo yang kamu pakai, tidak perlu edit kode apa pun secara manual.

Kalau nanti mau tetap coba Vercel/Netlify sebagai alternatif, project ini
tetap kompatibel — tinggal import repo-nya di sana seperti biasa.

## Penting: soal link ke tamu (baca ini dulu)

Secara default, aplikasi ini menyimpan data di **localStorage** — artinya
data tersimpan di browser tempat undangan itu dibuat. Ini cukup untuk:

- Mendesain dan mengedit undangan
- Mengunduh hasilnya sebagai gambar PNG
- Menyimpan "Undangan Saya" dan "Template Saya" untuk dipakai lagi **di
  browser yang sama**

Tapi **link yang dibagikan ke tamu hanya akan terbuka di browser/perangkat
yang sama dengan yang dipakai untuk membuatnya**. Kalau tamu membuka link
itu dari HP mereka sendiri, mereka akan melihat "Undangan tidak ditemukan" —
karena localStorage tidak berbagi data antar perangkat.

### Supaya link benar-benar bisa dibuka siapa saja, di perangkat apa saja

Aktifkan penyimpanan lewat [Supabase](https://supabase.com) (gratis untuk
skala kecil):

1. Buat project baru di Supabase
2. Buka **SQL Editor** di dashboard Supabase, jalankan isi file
   `supabase/schema.sql` dari folder ini
3. Di Supabase, buka **Project Settings → API**, salin **Project URL** dan
   **anon public key**
4. Untuk coba di komputer: copy `.env.example` jadi `.env`, isi dua
   variabel itu:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxx
   ```
   lalu jalankan ulang `npm run dev`.
5. Untuk versi yang di-deploy lewat GitHub Pages: buka repo di GitHub →
   **Settings → Secrets and variables → Actions → New repository secret**,
   tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan nilai
   yang sama. Workflow di `.github/workflows/deploy.yml` sudah otomatis
   memakainya di build berikutnya — cukup push apa pun ke `main`, atau
   trigger manual lewat tab **Actions → Deploy to GitHub Pages → Run
   workflow**, untuk redeploy dengan Supabase aktif.

Setelah itu, `src/lib/storage.js` otomatis memakai Supabase, dan link
undangan bisa dibuka siapa pun tanpa perlu login. Kalau env variable-nya
kosong, aplikasi otomatis kembali memakai localStorage — jadi aman dicoba
kapan saja, tidak akan merusak apa pun kalau belum siap pakai Supabase.

Catatan: karena tidak ada sistem login di aplikasi ini, kebijakan keamanan
(row-level security) di `supabase/schema.sql` sengaja dibuat terbuka —
cukup untuk proyek pribadi/prototype. Kalau nanti mau menambah akun
pengguna sungguhan, policy itu perlu diperketat.

## Struktur proyek

```
src/
  App.jsx              komponen utama: galeri, editor, tampilan tamu
  main.jsx             entry point React
  index.css            Tailwind
  lib/
    storage.js          pemilih otomatis localStorage vs Supabase
    storage.local.js     backend localStorage (default)
    storage.supabase.js  backend Supabase (opsional)
supabase/
  schema.sql           skema tabel untuk opsi Supabase
```

## Kustomisasi

- **Template**: cari `TEMPLATE_BUILDERS` di `src/App.jsx` — setiap kategori
  (wedding, birthday, dst) punya array berisi fungsi yang mengembalikan
  desain (background + elemen). Tambah entri baru ke array itu untuk
  menambah varian template, lalu update `TEMPLATE_NAMES` dan
  `TEMPLATE_COUNT` (kalau jumlah varian antar kategori dibuat berbeda,
  sesuaikan bagian yang memakai `TEMPLATE_COUNT` di `GalleryScreen`).
- **Warna & font app**: konstanta `INK`, `PAPER`, `BRAND`, `GOLD`, `MUTED`
  di bagian atas `src/App.jsx`, dan daftar `FONTS` untuk pilihan font teks.
- **Ukuran kanvas**: `CANVAS_W` dan `CANVAS_H` di `src/App.jsx`.
