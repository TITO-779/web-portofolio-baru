# Penjelasan Kode — Web Portofolio Baru

Dokumen ini menjelaskan isi kode website portofolio **www.tozall.my.id** secara menyeluruh:
teknologi, struktur folder, fungsi setiap halaman, database, efek animasi, GitHub, dan alur deploy.

> Folder `docs/` ini **hanya berisi dokumentasi**. File di sini tidak dibaca oleh Vite/React,
> tidak ikut di-build, dan tidak memengaruhi tampilan maupun fungsi website.

---

## Daftar Isi

1. [Gambaran Besar](#1-gambaran-besar-bagaimana-website-ini-bekerja)
2. [Teknologi yang Dipakai](#2-teknologi-yang-dipakai)
3. [Struktur Folder](#3-struktur-folder)
4. [Halaman & Routing](#4-halaman--routing)
5. [Penjelasan Setiap Bagian Website](#5-penjelasan-setiap-bagian-website)
6. [Database (Supabase)](#6-database-supabase--postgresql)
7. [Daftar Efek & Animasi](#7-daftar-efek--animasi)
8. [GitHub & Alur Deploy](#8-github--alur-deploy)
9. [Cara Menjalankan di Komputer](#9-cara-menjalankan-di-komputer)
10. [Catatan Perbaikan & Hal yang Masih Perlu Diperhatikan](#10-catatan-perbaikan--hal-yang-masih-perlu-diperhatikan)

---

## 1. Gambaran Besar: Bagaimana Website Ini Bekerja

```
 Pengunjung (Chrome)
        │
        ▼
 www.tozall.my.id ──► DNS Jagoan Hosting ──► VERCEL (hosting)
                                                │  berisi file hasil build (HTML + JS + CSS)
                                                ▼
                               Browser menjalankan aplikasi React (JavaScript)
                                     │                     │
                     ambil/simpan data                kirim pesan kontak
                                     ▼                     ▼
                          SUPABASE (database,        FormSubmit.co
                          login, penyimpanan         (meneruskan ke email
                          gambar, realtime)           nrfrzl@gmail.com)
```

**Poin penting:** project ini **tidak punya server backend buatan sendiri** (tidak ada Express/Node.js
yang berjalan). Semua kode yang ditulis adalah **front-end** (berjalan di browser pengunjung).
Peran "back-end" dipegang oleh layanan siap pakai:

| Peran back-end | Dikerjakan oleh |
|---|---|
| Database | Supabase (PostgreSQL) |
| Login admin | Supabase Auth |
| Penyimpanan gambar | Supabase Storage |
| Update komentar realtime | Supabase Realtime |
| Kirim email dari form kontak | FormSubmit.co |
| Hosting website | Vercel |

Pola seperti ini disebut **BaaS (Backend as a Service)**.

---

## 2. Teknologi yang Dipakai

| Lapisan | Teknologi | Fungsinya di project ini |
|---|---|---|
| Bahasa | **JavaScript (JSX)** | Semua file `.jsx` / `.js` di `src/`. JSX = JavaScript yang boleh menulis tag mirip HTML |
| Framework UI | **React 18** | Membangun tampilan dari komponen-komponen kecil yang bisa dipakai ulang |
| Build tool | **Vite** | `npm run dev` untuk lokal, `npm run build` untuk menghasilkan folder `dist/` |
| Styling | **Tailwind CSS** | Class seperti `bg-[#030014]`, `rounded-xl`, `blur-3xl` langsung di JSX |
| Komponen siap pakai | **Material UI (MUI)** | Tab Projects/Certificates/Tech Stack & popup sertifikat |
| Routing | **React Router** | Mengatur alamat `/`, `/project/...`, `/login`, `/dashboard` |
| Animasi | **AOS**, **Framer Motion**, animasi CSS/Tailwind | Efek muncul saat scroll, transisi welcome screen, dll |
| Swipe tab | **react-swipeable-views** | Tab portofolio bisa digeser di HP |
| Ikon | **lucide-react**, **MUI Icons** | Ikon GitHub, Mail, Code, dll |
| Popup | **SweetAlert2** | Notifikasi "Berhasil!" / "Gagal!" |
| HTTP | **axios** | Mengirim form kontak ke FormSubmit |
| SEO | **react-helmet-async** | Mengubah `<title>` & meta tag per halaman |
| Database & Auth | **Supabase** (`@supabase/supabase-js`) | Data project, sertifikat, komentar, login admin |
| Hosting | **Vercel** | Build & deploy otomatis setiap `git push` |
| Version control | **Git + GitHub** | Repository `TITO-779/web-portofolio-baru` |

### Di mana JavaScript dipakai?

| Tempat | Contoh penggunaan JavaScript |
|---|---|
| `src/main.jsx`, `src/App.jsx` | Menyalakan React & mengatur halaman |
| `src/Pages/*.jsx` | Logika halaman: efek mengetik, ambil data, kirim form, login |
| `src/components/*.jsx` | Logika komponen: navbar aktif saat scroll, gerakan background, upload foto komentar |
| `src/supabase.js` | Membuat koneksi ke Supabase |
| `src/utils/slug.js` | Fungsi mengubah judul menjadi URL |
| `index.html` | Script kecil untuk memuat font Google & data SEO (JSON-LD) |
| `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js` | File konfigurasi (juga JavaScript) |

Sedangkan **SQL** dipakai di `supabase-schema.sql` (dijalankan di Supabase, bukan di browser),
dan **CSS** di `src/index.css` (ditambah class Tailwind di dalam JSX).

---

## 3. Struktur Folder

```
web portofolio baru/
├── index.html              ← Satu-satunya file HTML. Berisi meta SEO + <div id="root">
├── package.json            ← Daftar library & perintah (dev, build, lint, preview)
├── package-lock.json       ← Versi pasti setiap library (jangan diedit manual)
├── vite.config.js          ← Konfigurasi Vite (plugin React)
├── tailwind.config.js      ← Konfigurasi Tailwind
├── postcss.config.js       ← Pemroses CSS untuk Tailwind
├── eslint.config.js        ← Aturan pengecekan kualitas kode
├── vercel.json             ← Semua URL diarahkan ke index.html (wajib untuk React Router)
├── .npmrc                  ← legacy-peer-deps=true (agar npm install di Vercel tidak gagal)
├── .env                    ← Kunci Supabase (TIDAK di-upload ke GitHub)
├── .env.example            ← Contoh isi .env
├── .gitignore              ← Daftar file yang tidak ikut ke GitHub
├── supabase-schema.sql     ← Script pembuat tabel & aturan keamanan database
├── SETUP-SUPABASE.md       ← Panduan setup Supabase
├── README.md               ← Deskripsi project
├── docs/
│   └── PENJELASAN-KODE.md  ← Dokumen ini
├── public/                 ← File statis, disalin apa adanya saat build
│   ├── Photo.jpg, Animation1.gif, ikon tech stack (.svg)
│   ├── robots.txt          ← Aturan untuk mesin pencari
│   ├── sitemap.xml         ← Peta halaman untuk Google
│   └── google....html      ← Verifikasi Google Search Console
└── src/
    ├── main.jsx            ← Titik awal: memasang <App /> ke #root
    ├── App.jsx             ← Pengatur halaman (routing)
    ├── supabase.js         ← Koneksi ke Supabase
    ├── index.css           ← CSS global (font Poppins, scrollbar, animasi)
    ├── utils/slug.js       ← Ubah judul jadi URL ("My App" → "my-app")
    ├── Pages/              ← Halaman / section besar
    │   ├── WelcomeScreen.jsx
    │   ├── Home.jsx
    │   ├── About.jsx
    │   ├── Portofolio.jsx
    │   ├── Contact.jsx
    │   ├── Login.jsx
    │   ├── Dashboard.jsx
    │   ├── 404.jsx
    │   ├── ThankYou.jsx    ← (belum dipakai di routing)
    │   └── dashboard/      ← Panel admin
    │       ├── Projects.jsx
    │       ├── Certificates.jsx
    │       └── Comments.jsx
    └── components/         ← Potongan UI yang dipakai ulang
        ├── Navbar.jsx, Footer.jsx, Background.jsx
        ├── CardProject.jsx, Certificate.jsx, TechStackIcon.jsx
        ├── Commentar.jsx, SocialLinks.jsx, PresenceWidget.jsx
        ├── ProjectDetail.jsx, ProtectedRoute.jsx
        └── Modal.jsx, InputField.jsx, LoadingScreen.jsx  ← (belum dipakai)
```

**Urutan saat website dibuka:**
`index.html` → `src/main.jsx` → `src/App.jsx` → halaman dipilih sesuai URL.

---

## 4. Halaman & Routing

Diatur di [`src/App.jsx`](../src/App.jsx).

| URL | Isi | Siapa yang bisa akses |
|---|---|---|
| `/` | Welcome Screen → Home, About, Portofolio, Contact, Footer (satu halaman panjang) | Semua orang |
| `/project/nama-project` | Detail satu project | Semua orang |
| `/login` | Form login admin | Semua orang (hanya admin yang lolos) |
| `/dashboard/projects` | Kelola project | **Hanya admin** |
| `/dashboard/certificates` | Kelola sertifikat | **Hanya admin** |
| `/dashboard/comments` | Kelola komentar | **Hanya admin** |
| URL lain | Halaman 404 | Semua orang |

Beberapa halaman dimuat dengan `lazy()` + `Suspense`. Kodenya baru diunduh saat dibutuhkan,
jadi loading awal lebih cepat (**code splitting**).

---

## 5. Penjelasan Setiap Bagian Website

### 5.1 Welcome Screen — [`src/Pages/WelcomeScreen.jsx`](../src/Pages/WelcomeScreen.jsx)

Layar pembuka yang tampil ±3,4 detik saat website pertama dibuka.

- Tiga ikon (Code, User, GitHub) muncul bergantian dari atas (**AOS `fade-down`**).
- Teks "Welcome To My Portfolio Website" muncul kata per kata.
- Tulisan `tozall.my.id` diketik huruf per huruf (**efek typewriter**, `setInterval`),
  dan bisa diklik menuju `https://www.tozall.my.id`.
- Saat menghilang: memudar, membesar sedikit, dan menjadi blur (**Framer Motion exit animation**).
- Setelah selesai, `App.jsx` menampilkan isi website utama.

### 5.2 Background Animasi — [`src/components/Background.jsx`](../src/components/Background.jsx)

Latar belakang yang menempel di seluruh halaman.

- 4 lingkaran warna (ungu, cyan, biru) yang sangat di-blur (`blur-[128px]`).
- Saat di-**scroll**, lingkaran bergerak mengikuti rumus `Math.sin` / `Math.cos`, jadi terlihat melayang.
- Ada pola **grid garis tipis** (kotak 24px) di atasnya.

### 5.3 Navbar — [`src/components/Navbar.jsx`](../src/components/Navbar.jsx)

- Awalnya transparan. Setelah scroll > 20px berubah gelap + blur (**glassmorphism**).
- Menu aktif otomatis berganti sesuai section yang sedang dilihat, dengan garis bawah gradien.
- Klik menu akan **scroll halus** ke section tujuan.
- Versi HP: tombol hamburger berputar saat diklik, item menu muncul bergantian dari kanan.

### 5.4 Home — [`src/Pages/Home.jsx`](../src/Pages/Home.jsx)

- Badge **"Ready to Innovate"** yang melayang.
- Judul besar **"Frontend Developer"** dengan teks gradien & cahaya blur di belakangnya.
- **Efek mengetik & menghapus** bergantian: "Network & Telecom Student" ↔ "Tech Enthusiast",
  lengkap dengan kursor berkedip (dibuat manual dengan `useState` + `setTimeout`).
- Badge tech stack (React, Javascript, Node.js, Tailwind).
- Tombol **Projects** & **Contact** (ikon bergeser/berputar saat hover).
- Ikon sosial media (GitHub, LinkedIn, Instagram).
- **GIF animasi** di kanan yang membesar & sedikit miring saat disorot mouse.
- **SEO:** `<Helmet>` mengisi title, meta description, canonical `https://www.tozall.my.id`,
  dan data terstruktur JSON-LD tipe "Person".

### 5.5 About — [`src/Pages/About.jsx`](../src/Pages/About.jsx)

- Perkenalan "Hello, I'm Mastito Nur Afrizal" + deskripsi diri.
- Kotak kutipan dengan efek kaca buram.
- Tombol **Download CV** (link Google Drive) & **View Projects**.
- **Foto profil bulat** dengan efek:
  - Cahaya gradien di belakang foto **berputar pelan** (8 detik/putaran) dan **berdenyut**.
  - Saat hover: foto membesar & miring, ada **kilatan cahaya** menyapu foto, border menebal.
- **3 kartu statistik:** Total Projects, Certificates, Years of Experience
  (tahun pengalaman dihitung otomatis sejak 6 November 2021).

### 5.6 Portofolio — [`src/Pages/Portofolio.jsx`](../src/Pages/Portofolio.jsx)

Tiga tab (MUI Tabs) yang juga bisa **digeser (swipe) di HP**:

1. **Projects** — data dari tabel `projects` Supabase, ditampilkan dalam kartu
   ([`CardProject.jsx`](../src/components/CardProject.jsx)). Gambar membesar saat hover,
   ada tombol *Live Demo* dan *Details*.
2. **Certificates** — data dari tabel `certificates`. Klik gambar → **popup layar penuh**
   dengan latar blur ([`Certificate.jsx`](../src/components/Certificate.jsx)).
3. **Tech Stack** — daftar ikon teknologi yang **ditulis langsung di kode** (bukan dari database).

- Awalnya hanya 6 item (4 di HP), sisanya lewat tombol **See More / See Less**.
- **Cache:** data juga disimpan di `localStorage` browser, supaya kunjungan berikutnya tampil
  lebih cepat sebelum data terbaru selesai diambil.

### 5.7 Detail Project — [`src/components/ProjectDetail.jsx`](../src/components/ProjectDetail.jsx)

Dibuka lewat `/project/judul-project`.

- Judul, deskripsi, jumlah teknologi & fitur, tombol **Live Demo** & **GitHub**.
- Jika kolom Github diisi `Private` → muncul popup SweetAlert "Source Code Private".
- Latar blob warna bergerak (`animate-blob`), konten masuk dari kiri & kanan (`slideInLeft/Right`).
- Meta SEO khusus per project, URL canonical `https://www.tozall.my.id/project/...`.

### 5.8 Contact — [`src/Pages/Contact.jsx`](../src/Pages/Contact.jsx)

**a. Form kontak**
- Isi: nama, email, pesan.
- Dikirim dengan **axios** ke `https://formsubmit.co/nrfrzl@gmail.com`,
  lalu FormSubmit meneruskannya ke email **nrfrzl@gmail.com**.
- Tampil popup loading → **Berhasil** / **Gagal** (SweetAlert2).

**b. Social Links** — [`src/components/SocialLinks.jsx`](../src/components/SocialLinks.jsx)
- LinkedIn, Instagram, YouTube (`https://www.youtube.com/@To-zall`), GitHub, TikTok.
- Efek hover: latar gradien warna brand + kilatan cahaya menyapu kartu.

**c. Kolom komentar publik** — [`src/components/Commentar.jsx`](../src/components/Commentar.jsx)
- Pengunjung menulis nama (maks 15 karakter), pesan (maks 200 karakter),
  dan foto profil opsional (maks 5MB, disimpan di Supabase Storage).
- **Realtime:** komentar baru langsung muncul di layar pengunjung lain tanpa refresh.
- Komentar yang di-*pin* admin tampil paling atas dengan label "Pinned" & "Admin".
- Waktu relatif: "Just now", "5m ago", "2h ago", dst.

### 5.9 Login & Dashboard Admin

**Login** — [`src/Pages/Login.jsx`](../src/Pages/Login.jsx)
- Login email + password lewat **Supabase Auth**.
- Setelah login, kolom `role` di tabel `profiles` dicek. Bukan `admin` → akses ditolak & otomatis logout.

**Penjaga halaman** — [`src/components/ProtectedRoute.jsx`](../src/components/ProtectedRoute.jsx)
- Membungkus `/dashboard`. Belum login atau bukan admin → diarahkan ke `/login`.

**Dashboard** — [`src/Pages/Dashboard.jsx`](../src/Pages/Dashboard.jsx)
- Sidebar (menjadi laci geser di HP) + tombol **Sign Out**.

| Menu | File | Fitur |
|---|---|---|
| Projects | [`dashboard/Projects.jsx`](../src/Pages/dashboard/Projects.jsx) | **CRUD** lengkap (tambah, lihat, edit, hapus) + upload gambar ke bucket `project-images`, skeleton loading |
| Certificates | [`dashboard/Certificates.jsx`](../src/Pages/dashboard/Certificates.jsx) | Upload **drag & drop**, preview, hapus |
| Comments | [`dashboard/Comments.jsx`](../src/Pages/dashboard/Comments.jsx) | Pin/unpin, hapus, filter, **pencarian dengan highlight kata**, **pagination** 10 per halaman |

Dengan dashboard ini, isi portofolio bisa dikelola **tanpa mengubah kode**:
buka `https://www.tozall.my.id/login` → masuk → kelola data.

### 5.10 Halaman Lain

| File | Fungsi |
|---|---|
| [`src/Pages/404.jsx`](../src/Pages/404.jsx) | Halaman "tidak ditemukan", tombol Kembali & Beranda |
| [`src/components/Footer.jsx`](../src/components/Footer.jsx) | "© tahun ToZall™. All Rights Reserved." (tahun otomatis) |
| [`src/components/TechStackIcon.jsx`](../src/components/TechStackIcon.jsx) | Kartu ikon untuk tab Tech Stack |
| [`src/components/PresenceWidget.jsx`](../src/components/PresenceWidget.jsx) | Widget status Spotify/VS Code/game (butuh server lokal, lihat bagian 10) |

---

## 6. Database (Supabase / PostgreSQL)

Didefinisikan di [`supabase-schema.sql`](../supabase-schema.sql).
Koneksi dibuat di [`src/supabase.js`](../src/supabase.js) memakai variabel dari `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 6.1 Tabel

| Tabel | Kolom penting | Dipakai oleh |
|---|---|---|
| `profiles` | `id`, `email`, `role` (`user` / `admin`), `created_at` | Login, ProtectedRoute |
| `projects` | `id`, `Title`, `Description`, `Img`, `TechStack[]`, `Features[]`, `Link`, `Github` | Portofolio, Detail, Dashboard |
| `certificates` | `id`, `Img` | Portofolio, Dashboard |
| `portfolio_comments` | `id`, `content`, `user_name`, `profile_image`, `is_pinned`, `created_at` | Komentar, Dashboard |

### 6.2 Storage (penyimpanan file)

| Bucket | Isi | Siapa yang boleh upload |
|---|---|---|
| `project-images` | Gambar project | Admin |
| `certificate-images` | Gambar sertifikat | Admin |
| `profile-images` | Foto profil komentar | Siapa saja |

Semua bucket bisa **dilihat** publik. Hanya admin yang boleh **menghapus** file.

### 6.3 Keamanan (Row Level Security / RLS)

- Semua orang **boleh membaca** projects, sertifikat, dan komentar.
- Semua orang **boleh menulis komentar**, tapi tidak bisa membuat komentar yang langsung ter-pin.
- **Hanya admin** yang boleh tambah/ubah/hapus projects & sertifikat, serta pin/hapus komentar.
- Fungsi `is_admin()` mengecek apakah user yang login punya `role = 'admin'`.
- **Trigger** `on_auth_user_created` otomatis membuat baris `profiles` saat ada user baru.

> **Tentang keamanan kunci:** `VITE_SUPABASE_ANON_KEY` memang terlihat di browser, dan itu **normal**.
> Keamanan data dijaga oleh aturan RLS di atas. Kunci yang **tidak boleh bocor** adalah
> `service_role` — jangan pernah menaruhnya di `.env` project ini.

### 6.4 Cara menjadikan akun sebagai admin

1. Supabase Dashboard → **Authentication → Users → Add user** (centang *Auto Confirm User*).
2. **SQL Editor**, jalankan:
   ```sql
   update public.profiles set role = 'admin' where email = 'email-anda@contoh.com';
   ```

---

## 7. Daftar Efek & Animasi

| Efek | Lokasi | Dibuat dengan |
|---|---|---|
| Layar pembuka memudar + blur | Welcome Screen | Framer Motion |
| Teks diketik huruf per huruf | Welcome Screen (`tozall.my.id`) | `setInterval` |
| Teks diketik & dihapus bergantian | Home | `useState` + `setTimeout` |
| Kursor berkedip | Home | Tailwind `animate-blink` |
| Elemen muncul saat di-scroll (fade, zoom) | Hampir semua section | AOS (`data-aos="..."`) |
| Lingkaran warna melayang mengikuti scroll | Background | JavaScript `Math.sin/cos` + CSS transform |
| Pola grid tipis | Background | CSS `linear-gradient` |
| Navbar transparan → kaca buram | Navbar | Tailwind `backdrop-blur-xl` |
| Garis bawah menu aktif | Navbar | Tailwind `scale-x` |
| Scroll halus ke section | Navbar | `window.scrollTo({ behavior: "smooth" })` |
| Teks gradien warna | Judul-judul | Tailwind `bg-clip-text text-transparent` |
| Cahaya blur di belakang tombol/judul | Home, About, Login | Tailwind `blur` + `opacity` |
| Badge melayang naik-turun | Home | `animate-float` |
| Gambar membesar/miring saat hover | Home, About, CardProject | Tailwind `group-hover:scale / rotate` |
| Cahaya berputar di belakang foto | About | Keyframes `spin-slower` |
| Kilatan cahaya menyapu foto/kartu | About, SocialLinks | `translate-x` + transition |
| Kartu naik saat hover | Statistik About, Sertifikat | `hover:scale-105`, `translateY(-5px)` |
| Tab bisa digeser di HP | Portofolio | react-swipeable-views |
| Popup sertifikat layar penuh | Portofolio | MUI Modal + Backdrop blur |
| Blob warna bergerak | Detail Project | Keyframes `blob` |
| Konten masuk dari kiri/kanan | Detail Project | Keyframes `slideInLeft/Right` |
| Popup notifikasi | Contact, Detail Project | SweetAlert2 |
| Skeleton loading berkedip | Dashboard | Tailwind `animate-pulse` |
| Spinner loading | Login, Dashboard | Tailwind `animate-spin` |
| Laci sidebar geser | Dashboard (HP) | Tailwind `translate-x` |
| Scrollbar ungu custom | Seluruh website | CSS `::-webkit-scrollbar` |

---

## 8. GitHub & Alur Deploy

**Repository:** https://github.com/TITO-779/web-portofolio-baru

### Alur kerja

1. Edit kode di VS Code.
2. Simpan ke GitHub:
   ```powershell
   git add .
   git commit -m "pesan perubahan"
   git push
   ```
3. **Vercel** otomatis mendeteksi push, lalu menjalankan `npm install` dan `npm run build`.
4. Hasil build (`dist/`) langsung aktif di **https://www.tozall.my.id** (±1–3 menit).

### File yang tidak ikut ke GitHub (`.gitignore`)

| File/Folder | Alasan |
|---|---|
| `node_modules/` | Terlalu besar; dibuat ulang dengan `npm install` |
| `dist/` | Hasil build; Vercel membuatnya sendiri |
| `.env` | Berisi kunci. Isi terpisah di **Vercel → Settings → Environment Variables** |

### Domain

| Record DNS (Jagoan Hosting) | Nilai |
|---|---|
| `A` — `tozall.my.id` | `76.76.21.21` (atau yang baru: `216.198.79.1`) |
| `CNAME` — `www` | `cname.vercel-dns.com` (atau nilai khusus dari Vercel) |

`tozall.my.id` otomatis dialihkan (308) ke `www.tozall.my.id`. HTTPS dibuat otomatis oleh Vercel.

---

## 9. Cara Menjalankan di Komputer

```powershell
npm install        # sekali saja / setelah menambah library
npm run dev        # jalankan lokal → buka http://localhost:5173
npm run build      # tes build seperti di Vercel
npm run preview    # lihat hasil build secara lokal
npm run lint       # cek kualitas kode
```

Pastikan file `.env` sudah terisi. Setelah mengubah `.env`, dev server **wajib di-restart**.

---

## 10. Catatan Perbaikan & Hal yang Masih Perlu Diperhatikan

### ✅ Sudah diperbaiki

| Perbaikan | File |
|---|---|
| Build Vercel gagal karena konflik versi React → ditambah `.npmrc` | `.npmrc` |
| Email form kontak diganti ke **nrfrzl@gmail.com** | `src/Pages/Contact.jsx` |
| Semua domain `tozall.com` / `eki.my.id` diganti ke **https://www.tozall.my.id** | `index.html`, `Home.jsx`, `WelcomeScreen.jsx`, `ProjectDetail.jsx`, `Footer.jsx`, `public/robots.txt`, `public/sitemap.xml`, `README.md` |
| Link YouTube diganti ke **https://www.youtube.com/@To-zall** | `src/components/SocialLinks.jsx` |

> **Penting untuk FormSubmit:** saat form kontak pertama kali dipakai dengan email baru,
> FormSubmit mengirim **email aktivasi** ke nrfrzl@gmail.com. Buka email itu dan klik
> **Activate Form**. Sebelum diaktivasi, pesan pengunjung belum akan diteruskan.

### ⚠️ Masih perlu diperhatikan

1. **Link sosial media lain belum seragam.** GitHub tertulis `ToZall` / `To_Zall99` (Home & `index.html`)
   tetapi `TITO-779` di SocialLinks. LinkedIn dan Instagram juga berbeda antar file.
   Pastikan semuanya akun milik sendiri.
2. **PresenceWidget memanggil `http://localhost:3001`.** Hanya bekerja di komputer sendiri.
   Di website online widget tidak tampil dan memunculkan error di console setiap 5 detik.
3. **Statistik About bisa menunjukkan 0** saat kunjungan pertama, karena angkanya dibaca dari
   `localStorage` yang baru terisi setelah section Portofolio selesai memuat data.
4. **Halaman 404 bertema terang**, tidak serasi dengan tema gelap website.
5. **Beberapa library terpasang tapi tidak dipakai:** `firebase`, `gsap`, `@splinetool/*`,
   `@lottiefiles/*`, `typewriter-effect`, `@react-spring/web`, `styled-components`, `headlessui`, dll.
   Tidak merusak, tetapi memperlambat `npm install`.
6. **Komponen yang belum dipakai:** `ThankYou.jsx`, `Modal.jsx`, `InputField.jsx`, `LoadingScreen.jsx`.
