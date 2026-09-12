# Setup Supabase — Portofolio V5

Folder ini adalah **salinan** dari `D:\SINAU CODING\web portofolio\Portofolio_V5-main`.
Folder lama sengaja dibiarkan utuh sebagai cadangan.

**Kenapa perlu setup ulang?** Project Supabase yang dipakai versi lama
(`ujoulhldwvxxetcdumqi.supabase.co`) sudah tidak ada — host-nya tidak lagi
terdaftar di DNS, jadi semua data (projects, sertifikat, komentar, login admin)
gagal dimuat. Tampilan website tetap jalan, isinya saja yang kosong.

Butuh sekitar 10 menit. Gratis, tanpa kartu kredit.

---

## 1. Buat project Supabase baru

1. Buka <https://supabase.com/dashboard> → login (bisa pakai akun GitHub/Google).
2. **New project**
   - **Name:** `portofolio-v5` (bebas)
   - **Database Password:** bikin yang kuat, **simpan** — tidak bisa dilihat lagi.
   - **Region:** `Southeast Asia (Singapore)` — paling dekat dari Indonesia.
3. Tunggu ± 2 menit sampai statusnya hijau / *Active*.

> Catatan: project gratis akan di-*pause* otomatis kalau tidak dipakai ± 1 minggu.
> Cukup klik **Restore** di dashboard untuk menghidupkannya lagi. Kalau dibiarkan
> ter-pause sangat lama, project bisa dihapus — persis seperti yang terjadi pada
> project lama.

## 2. Jalankan schema

1. Di sidebar kiri, pilih **SQL Editor** → **New query**.
2. Buka file [`supabase-schema.sql`](supabase-schema.sql) di folder ini,
   **copy seluruh isinya**, paste ke editor.
3. Klik **Run** (atau `Ctrl+Enter`). Harus muncul *Success. No rows returned*.

Yang dibuat oleh script itu:

| Objek | Isi |
|---|---|
| Tabel `projects` | `Title`, `Description`, `Img`, `TechStack[]`, `Features[]`, `Link`, `Github` |
| Tabel `certificates` | `Img` |
| Tabel `portfolio_comments` | `content`, `user_name`, `profile_image`, `is_pinned` |
| Tabel `profiles` | `id`, `email`, `role` — penentu siapa admin |
| Storage bucket | `project-images`, `certificate-images`, `profile-images` (public) |
| RLS | Publik boleh **baca** & kirim komentar; hanya **admin** yang boleh tambah/ubah/hapus |
| Realtime | Aktif di tabel komentar |
| Trigger | Profil otomatis dibuat tiap ada user baru |

## 3. Ambil kunci API dan isi `.env`

1. Sidebar → **Project Settings** → **API**.
2. Salin dua nilai ini:
   - **Project URL** → contoh `https://abcdefghij.supabase.co`
   - **Project API keys → `anon` / `public`** → string panjang diawali `eyJ...`

   > Jangan pakai `service_role`. Kunci itu punya akses penuh dan akan bocor ke
   > pengunjung kalau dipakai di frontend.

3. Buka file `.env` di folder ini, isi jadi seperti:

   ```env
   VITE_SUPABASE_URL=https://abcdefghij.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
   ```

   Tanpa tanda kutip, tanpa spasi sebelum/sesudah `=`.

4. **Restart dev server** (`Ctrl+C` lalu `npm run dev`). Vite hanya membaca
   `.env` saat start — ini penyebab error paling sering.

## 4. Bikin akun admin

1. Sidebar → **Authentication** → **Users** → **Add user** → *Create new user*.
   - Isi email + password, **centang `Auto Confirm User`**.
2. Kembali ke **SQL Editor**, jalankan (ganti emailnya):

   ```sql
   update public.profiles
      set role = 'admin'
    where email = 'email-kamu@contoh.com';
   ```

3. Cek berhasil:

   ```sql
   select id, email, role from public.profiles;
   ```

   Kolom `role` harus `admin`. Kalau barisnya belum ada, berarti trigger belum
   sempat jalan — buat ulang user-nya, atau insert manual dengan `id` dari
   halaman Authentication > Users.

## 5. Jalankan & isi konten

```powershell
cd "D:\SINAU CODING\web portofolio baru"
npm run dev
```

- Website: <http://localhost:5173>
- Login admin: <http://localhost:5173/login>
- Dashboard: <http://localhost:5173/dashboard> (Projects / Certificates / Comments)

Tambahkan project dan sertifikat lewat dashboard — gambarnya otomatis diunggah
ke Storage dan langsung muncul di halaman depan.

---

## Kalau masih bermasalah

| Gejala | Penyebab & solusi |
|---|---|
| Halaman blank putih | Buka DevTools (F12) → tab Console, baca error pertamanya |
| Peringatan `[supabase] ... belum diisi di .env` | `.env` masih kosong, atau dev server belum di-restart |
| Data tetap kosong, Console: `Failed to fetch` | URL di `.env` salah, atau project Supabase sedang *paused* |
| Console: `permission denied for table ...` | `supabase-schema.sql` belum dijalankan sampai selesai |
| Login sukses tapi muncul `Access denied` | `role` di tabel `profiles` belum diubah jadi `admin` (langkah 4) |
| Upload gambar gagal | Bucket belum dibuat, atau kamu login sebagai user non-admin |
| Data lama muncul padahal tabel kosong | Sisa cache `localStorage` — hard refresh `Ctrl+Shift+R` |

## Catatan lain

- Halaman `/portofolio` memang **404**. Ini situs satu halaman; menu Portofolio
  menggulir ke section `#Portofolio` di `/`. Route yang valid hanya `/`,
  `/project/:slug`, `/login`, dan `/dashboard/*`.
- Halaman Contact tidak memakai Supabase — kirim pesannya lewat FormSubmit.
- Jangan pernah commit file `.env` ke GitHub (`.gitignore` sudah menutupinya).
- Untuk online: `npm run build`, lalu deploy ke Vercel. `vercel.json` sudah ada.
  Kedua variabel `VITE_...` harus didaftarkan lagi di
  **Vercel → Settings → Environment Variables**.
