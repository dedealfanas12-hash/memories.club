# Momenku

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

## Deploy supaya bisa diakses publik

Paling gampang pakai [Vercel](https://vercel.com) atau
[Netlify](https://netlify.com):

1. Push folder ini ke sebuah repo GitHub
2. Di Vercel/Netlify, pilih "Import Project" / "Add new site" dari repo itu
3. Build command: `npm run build`, output folder: `dist` — biasanya
   terdeteksi otomatis karena ini proyek Vite
4. Deploy

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
4. Copy `.env.example` jadi `.env`, isi dua variabel itu:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxx
   ```
5. Jalankan ulang `npm run dev` (atau redeploy kalau sudah online)

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
