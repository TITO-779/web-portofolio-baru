import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kalau .env belum diisi, jangan bikin seluruh halaman blank —
// cukup beri peringatan. Data (projects/certificates/komentar) akan kosong,
// tapi tampilan tetap bisa dilihat. Lihat SETUP-SUPABASE.md.
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi di .env — " +
      "projects, certificates, dan komentar tidak akan termuat. Baca SETUP-SUPABASE.md."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-anon-key"
);