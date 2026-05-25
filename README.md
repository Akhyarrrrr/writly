# Writly

Platform blog modern untuk menulis, menerbitkan, dan berbagi artikel. Dibangun dengan Next.js, Supabase, dan editor Tiptap — UI gelap minimalis ala Linear/Vercel.

![Writly](./public/logo.png)

## Fitur

- **Landing** — hero animasi, bagian About, post unggulan
- **Blog publik** — daftar artikel, filter kategori, halaman detail SEO
- **Admin** — dashboard, editor kaya teks, draft/publish, pengaturan profil
- **Auth** — registrasi & login via Supabase Auth
- **Keamanan** — Row Level Security (RLS) di Postgres

## Tech stack

| Lapisan | Teknologi |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase |
| Editor | Tiptap |
| Animasi | Framer Motion |

## Persiapan

### 1. Clone & install

```bash
git clone https://github.com/Akhyarrrrr/writly.git
cd writly
npm install
```

### 2. Supabase

1. Buat proyek di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → jalankan seluruh isi `supabase/schema.sql` (sekali saja untuk setup baru)
3. Di **Authentication → URL Configuration**, tambahkan redirect URL:
   - `http://localhost:3000/**`
   - URL production kamu (mis. `https://writly.vercel.app/**`)

### 3. Environment

Salin `.env.local.example` ke `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) → daftar akun → tulis post pertama di `/admin/posts/new`.

## Deploy (Vercel)

1. Push repo ke GitHub
2. Import proyek di [vercel.com](https://vercel.com)
3. Set environment variables yang sama seperti `.env.local`
4. Set `NEXT_PUBLIC_APP_URL` ke URL production
5. Tambahkan URL production di Supabase Auth redirect

## Struktur proyek

```
app/              Halaman (landing, blog, auth, admin)
components/       UI, editor, blog, motion
lib/              Supabase client, posts, utils
public/logo.png   Logo & favicon
supabase/         schema.sql (database + RLS)
```

## Lisensi

Proyek portofolio — bebas dipakai sebagai referensi.
